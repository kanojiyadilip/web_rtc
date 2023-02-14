import { Injectable, OnInit, } from '@angular/core';
import 'rxjs/Rx';
import { HttpClient, HttpParams, HttpHeaders,HttpUrlEncodingCodec, HttpEventType } from "@angular/common/http";
import { Router } from '@angular/router';
import { map } from  'rxjs/operators';
import { Chat } from './chat.model';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';

let date = new Date(),
    day = date.getDate(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hour = date.getHours(),
    minute = date.getMinutes();

let chats = [
    new Chat(
        'assets/img/profile/ashley.jpg',
        'Ashley Ahlberg', 
        'Online',
        'Great, then I\'ll definitely buy this theme. Thanks!',
        new Date(year, month, day-2, hour, minute),
        false
    )
]

let talks = [
    new Chat(
        'assets/img/profile/ashley.jpg',
        'Ashley Ahlberg', 
        'Online',
        'Hi, I\'m looking for admin template with angular material 2 design.  What do you think about Gradus Admin Template?',
        new Date(year, month, day-2, hour, minute+3),
        false
    )
]
const APIURL = 'http://localhost:3001';
// const APIURL = 'https://chatdk.herokuapp.com';
@Injectable()
export class ChatService implements OnInit {

    currentUser = {};
    headers;
    org_id = '';  
    receiver_id: any;

    messageText: string;
    messages = [];
    users = [];
    socket: SocketIOClient.Socket;
    typeingKy: boolean = false;
    timeout = undefined;
    baseUrl: any = APIURL;
    smsRing: any;
    thisUserOnline: any;
    currentChat: any;
    callerData: any;
    
    callingData: any;
    private _userDetails: Subject<any> = new Subject<any>();    // consider putting the actual type of the data you will receive
    public userDetailsObs = this._userDetails.asObservable();


    constructor(private httpClient: HttpClient,  private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('chatuser')); 
        this.socket = io.connect(APIURL);
        // this.socket.on('connect', function () {
            this.socket.emit('join', this.currentUser['_id']);
            this.socket.on("user_connected", function(user){
                console.log("user_connected================>", user);
            })
        // });

        this.socket.on('self', (data: any) => {
            console.log("-----------------------private------------>", data);
            // this.messages.push(data);
        })
        
        this.socket.on('broadcastMsg', (data: any) => {
            // console.log("this.receiver_id---------------->",this.receiver_id);
            // console.log("data.receiver_id---------------->",data.receiver_id);
            // console.log("this.currentUser['_id']--------->",this.currentUser['_id']);
            // console.log("data.sender_id------------------>",data.sender_id);
            // console.log("my broadcast--------->",data);
            // this.baseUrl = APIURL;
            console.log(APIURL,"data--------->",data);
            if(this.currentUser['_id'] == data.receiver_id){
                this.getAllUserByUser({user_id: this.currentUser['_id']});
                this.ring();
            }

            if(this.receiver_id == data.sender_id && this.currentUser['_id'] == data.receiver_id){
                // this.ring();
                this.messages.push(data);
                this.typeingKy = false;
            }

            if(this.currentUser['_id'] == data.sender_id){
                // this.ring();
                this.messages.push(data);
                // this.typeingKy = false;
            }            

        });

        // vCAM---------------------------------------

        this.socket.on('vCallAttempt', (data: any) => {
            // console.log("my broadcast--------->",data);
            // this.baseUrl = APIURL;
            console.log(APIURL,"data--------->",data);
            if(this.currentUser['_id'] == data.receiver_id){
                this.callerData = data;
                this.ring();
            }          

        });

       this.socket.on('typing', (data: any) => {
        console.log("=====typing==1===", this.typeingKy);
            if(this.receiver_id == data.sender_id && this.currentUser['_id'] == data.receiver_id){
                if(this.typeingKy == false){
                    this.typeingKy = true;

                    this.timeout = setTimeout(() => {
                        this.typeingKy = false;
                    }, 5000);
                }
                else{
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.typeingKy = false;
                    }, 5000);
                }
            }
            else{
                this.typeingKy = false;
            }
       }) 

        this.socket.on('calling', (data: any) => {
            console.log("=====calling==1===", data);
            this.callingData = data;
            this._userDetails.next(data)
            if(this.currentUser['_id'] == data.receiver_id){
                this.getAllUserByUser({user_id: this.currentUser['_id']});
                this.ring();
            }

            if(this.receiver_id == data.sender_id && this.currentUser['_id'] == data.receiver_id){
                // this.ring();
                // this.messages.push(data);
                this.typeingKy = false;
            }

            if(this.currentUser['_id'] == data.sender_id){
                // this.ring();
                // this.messages.push(data);
                // this.typeingKy = false;
            } 
       })

       this.socket.on('thisUserOnlineUpdate', (data: any) => {
        console.log(data['data']['is_live'],"=====thisUserOnlineUpdate==1===", data);
        console.log("=====thisUserOnlineUpdate==2===", this.users);
        this.users.find(x => x._id == data['data']['_id'])['is_live'] = data['data']['is_live'];
        if(this.currentChat){
            if(this.currentChat['_id'] == data['data']['_id']){
                this.currentChat['is_live'] = data['data']['is_live'];
            }
        }        
        console.log("=====thisUserOnlineUpdate==3===", this.users);
       })
      }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('chatuser'));
        this.headers = new  HttpHeaders().set("user_id", this.currentUser['_id'])
                                            .set("token",this.currentUser['token'])
                                            .set("Content-Type", "application/x-www-form-urlencoded");
        this.org_id = this.currentUser['org_id'] || '';
    }    
        
    // timeoutFunction(){
    //     this.typeingKy = false;
    //     socket.emit(noLongerTypingMessage);
    // }
      
      
    public getChats():Array<Chat> {
        return chats;
    }

    public getTalk():Array<Chat> {
        return talks;
    }    

    getAllChatBySenderAndReceiver(data) {
        // console.log(localStorage.getItem('chatuser'),"this.currentUse------>", this.currentUser);
        data.sender_id = this.currentUser['_id'];
        // console.log("data=======>", data);
        this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return this.httpClient.post(`${APIURL}/api/msg/get_message_by_user`,data).map(response => { 
            this.messages = response['data'];
            console.log("this.messages------------>", this.messages);
        });
    }

    getAllUserByUser(data) {
        this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return this.httpClient.post(`${APIURL}/api/users/get_all_users`,data).map(response => { 
            this.users = response['data'];
            console.log("this.users------------>", this.users);
        });
    }
  
    sendMsg(data){
        data.sender_id = this.currentUser['_id'];
        data.created_timestamp = new Date().valueOf();
        console.log("dat------->", data)
        this.socket.emit('sendMessage', data);
        this.messages.push(data);
        console.log("this.messages------->", this.messages)
        // return true;
    }

    typeing(data){
        // console.log("-----------call_typeing_function",data);
        data.sender_id = this.currentUser['_id'];
        this.socket.emit('typing', data); 
    }

    vcall(data){
        console.log("-----------vcall--------->",data);
        data.sender_id = this.currentUser['_id'];
        this.socket.emit('vcall', data); 
    }    

    ring(){
        this.smsRing = new Audio();
        this.smsRing.src = 'assets/rington/sms_iphone.mp3';
        this.smsRing.load();
        this.smsRing.play();
    }

    updateUserOnline(data){
        this.socket.emit('thisUserOnline', data); 
    }

    // thisUseronline(){
    //     if(this.currentUser['_id']){
    //         this.thisUserOnline = JSON.parse(localStorage.getItem('thiUser'))['onLine'] || false;
    //         console.log("this.thisUserOnline----------------------->",this.thisUserOnline);
    //         if(this.thisUserOnline){
    //             return false;
    //         }
    //         else{
    //             localStorage.setItem('thiUser', JSON.stringify({"onLine": true,})); 
    //             return true;
    //         }
    //     }
    // }

    calling(data){
        // console.log("-----------call_typeing_function",data);
        data['sender_id'] = this.currentUser['_id'];
        this.socket.emit('calling', data); 
    }
}

