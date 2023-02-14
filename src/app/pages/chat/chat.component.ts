// import { Component, OnInit, HostListener, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit, ViewChild, AfterViewChecked, EventEmitter, Output, ElementRef, HostListener, Renderer, SecurityContext, ViewEncapsulation, Renderer2, TemplateRef} from '@angular/core';

import { trigger, transition, useAnimation } from '@angular/animations';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { Chat } from './chat.model';
import { ChatService } from './chat.service';
import { CommonService } from '../../common.service';
import { zoomIn, bounceIn, flip } from 'ng-animate';
import { FormControl } from '@angular/forms';
import Peer from 'peerjs';
// import * as io from 'socket.io-client';
// declare var SimplePeer: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ ChatService ],
  animations: [
    trigger('bounce', [transition(':enter', useAnimation(bounceIn)),]),
    trigger('zoomIn', [transition(':enter', useAnimation(zoomIn)),])
  ],  
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private peer: Peer;
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public settings: Settings;
  public userImage = 'assets/img/users/user.jpg';
  public chats: Array<Chat>;
  public talks: Array<Chat>;
  public APIURL: String;
  public sidenavOpen:boolean = true;
  public currentChat:{};
  public newMessage:string;
  public users: any;
  public chatData: any;
  public textArea: boolean= false;
  public receiverUser: any;
  public bounce: any;
  public commentForm: any = document.querySelector('#matMenuTrigger')
  public searchOverlay: false
  searchKey = new FormControl();
  searchData: any = [{}];
  showChat: boolean = false;
  chatlogo: string = 'assets/img/logo/logo.svg';
  smsRing: any;
  personMenuTrigger: any;
  // messageText: string;
  // messages: Array<any>;
  // socket: SocketIOClient.Socket;




  @ViewChild('myVideoCtr') myVideoCtr: any;
  @ViewChild('otherUserVideoCtr') otherUserVideoCtr: any;

  lineNo: string;
  error = '';
  info = '';
  // peer: any = null;
  myVideo: any;
  otherUserVideo: any;
  // myPeerDetails: any = null;
  // otherUserPeerDetails: any = null;
  isInitiator = true;
  vchat: Boolean = false;
  // myIceServers = [
  //   {
  //     "urls": "stun:numb.ca",
  //   },
  //   {
  //     "urls": "turn:numb.viagenie.ca",
  //     "username": "yanivmail2@gmail.com",
  //     "credential": "123456"
  //   }
  // ]


  proPic: any = "";
  constructor(public appSettings:AppSettings, public chatService:ChatService, public _com: CommonService) { 

    console.log("===chatService.callingData========>", this.chatService.callingData);
    this.proPic = (this.chatService.currentUser['profile_pic'])?(!this.chatService.currentUser['profile_pic'].includes('https'))?(this.chatService.baseUrl + this.chatService.currentUser['profile_pic']):(this.chatService.currentUser['profile_pic']):('assets/img/profile/default_user.png');

    this.peer = new Peer();
    
    this.settings = this.appSettings.settings; 
    this.getAllUserByUser({user_id: this.chatService.currentUser['_id']});
    this.chatData = this.chatService.messages;
    // this.socket = io.connect('http://localhost:3001');
    // this.socket.on('broadcastMsg', (data: string) => {
        console.log("my chatService.baseUrl------1--->",chatService.baseUrl);
    //     this.chatService.messages.push(data);
    // });
  }

  ngOnInit() {
    this.getPerrId();

    this.thisUseronline();
    this.chats = this.chatService.getChats(); 
    if(window.innerWidth <= 768){
      this.sidenavOpen = false;
    } 
    this.talks = this.chatService.messages;  
    console.log(this.talks,"-----chatService.messages-------------->", this.chatService.messages); 

    this.searchKey.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(searchValue => {
      console.log("searchValue=>", searchValue);
      this.search(searchValue);
    })
    this.searchData.length = 0;
    // setTimeout(() => {
    //   this.pageRender = true;
    // }, 1000);
  
  
    this.myVideo = this.myVideoCtr.nativeElement;
    this.otherUserVideo = this.otherUserVideoCtr.nativeElement;
    console.log("this.otherUserVideo --------->", this.otherUserVideo );

    this.chatService.userDetailsObs.subscribe((userDetails) => {
      console.log(Object.keys(userDetails).length,"======callingDetail----->",userDetails)
      if(Object.keys(userDetails).length>=3){
        if(userDetails.peerId){
          this.callPeer(userDetails.peerId,{});
          // this.getPerrId();
        }
      }
    })
  } 

  ngAfterViewChecked() {      
    // console.log("ngAfterViewChecked--------->");  
    // this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
      console.log("scrollToBottom--------->"); 
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth <= 768) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event) {
    // this.ring();
    console.log("beforeUnloadHandler event------------->", event);
    this.thisUseroffline();
  }
  // public getChat(obj){
  //   if(this.talks){
  //      this.talks.length = 2;
  //   }   
  //   this.talks = this.chatService.getTalk();
  //   this.talks.push(obj);
  //   this.currentChat = obj;      
  //   this.talks.forEach(talk => {
  //     if(!talk.my){
  //       talk.image = obj.image;
  //     }
  //   });
  //   if(window.innerWidth <= 768){
  //     this.sidenav.close();
  //   }     
  // }

  public getChat(obj){
    console.log("obj=======>", obj);
    this.chatService.currentChat = obj;
    this.receiverUser = obj;
    this.chatService.receiver_id = obj._id;
    let objectData = {}
    objectData['receiver_id'] = obj._id;
    // obj.sender_id = obj._id;
    this.chatService.getAllChatBySenderAndReceiver(objectData).subscribe(data =>{
      // this.chatData = data['data'];
      
      this.textArea = true;
      // console.log("this.chatData---------->",this.chatData);
    })
  }

  public sendMessage($event) {    
    this.chatService.typeing({receiver_id: this.receiverUser['_id'], typeing_key: this.newMessage});
    // console.log("$event------->",$event.which, this.newMessage, this.receiverUser['_id']);
    if (($event.which === 1 || $event.which === 13) && this.newMessage.trim() != '') {

      let obj = {
        _id: '',
        sender_id:'',
        receiver_id: this.receiverUser['_id'],
        message: this.newMessage
      }   

      this.chatService.sendMsg(obj);

      this.newMessage = '';
      if(this.talks){ 

        // this.talks.push(
        //     new Chat(
        //       'assets/img/users/user.jpg', 
        //       'Emilio Verdines', 
        //       'online', 
        //       this.newMessage,
        //       new Date(), 
        //       true)
        // )
        this.newMessage = '';
        let chatContainer = document.querySelector('.chat-content');
        if(chatContainer){
          setTimeout(() => {
            var nodes = chatContainer.querySelectorAll('.mat-list-item');
            let newChatTextHeight = nodes[nodes.length- 1];
            chatContainer.scrollTop = chatContainer.scrollHeight + newChatTextHeight.clientHeight;
          }); 
        }
      }
    }
  }

  public ngOnDestroy(){
    if(this.talks)
      this.talks.length = 2;
  }

  public getAllUserByUser(reqData){
    console.log("reqData=======", reqData);
    this.chatService.getAllUserByUser(reqData).subscribe(
      data => {
        // console.log("POST Request is successful ", data);
        // if (data['code'] == 200) {
          console.log("200=======", data);
          // console.log(data['code'],data['data']['role']);
          // this.users = data['data'];
          // localStorage.setItem('chatuser', JSON.stringify(data['data'])); 
        // }
      // else{
        // this.errMsg = "true";
        // console.log("400=======");
      // }            
    });
  }

  search(key){
    // console.log(key)
    this._com.searchUser({key: key}).subscribe(result=>{
      console.log("result=>", result);
      this.searchData = result['data']
    })
  }

  ring(){
    this.smsRing = new Audio();
    this.smsRing.src = 'assets/rington/sms_iphone.mp3';
    this.smsRing.load();
    this.smsRing.play();
  }

  thisUseronline(){
    if(this.chatService.currentUser['_id']){
        this.chatService.thisUserOnline = JSON.parse(localStorage.getItem('thiUser'))?JSON.parse(localStorage.getItem('thiUser'))['onLine'] : false;
        console.log("this.thisUserOnline----------------------->",this.chatService.thisUserOnline);
        if(this.chatService.thisUserOnline){
            return false;
        }
        else{
            localStorage.setItem('thiUser', JSON.stringify({"onLine": true,})); 
            this.chatService.updateUserOnline({id: this.chatService.currentUser['_id'], is_live: true});
            return true;
        }
    }
  }

  thisUseroffline(){
    if(this.chatService.currentUser['_id']){
      this.chatService.thisUserOnline = JSON.parse(localStorage.getItem('thiUser'))?JSON.parse(localStorage.getItem('thiUser'))['onLine'] : false;
        console.log("this.thisUseroffline----------------------->",this.chatService.thisUserOnline);
        if(this.chatService.thisUserOnline){
          localStorage.setItem('thiUser', JSON.stringify({"onLine": false,})); 
          this.chatService.updateUserOnline({id: this.chatService.currentUser['_id'], is_live: false});          
            return false;
        }
        else{
            return true;
        }
    }
  }

  chooseFile(){
    let event = document.getElementById("fileInput").click();
    console.log("event-------------------=======>",event);
    // this.readThis($event.target);
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }
   
  image: any;
  readThis(inputValue: any): void {
      var file = inputValue.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => { 
        this.image = event.target.result;
        console.log("image---image--->", this.image);
        let obj = {
          _id: '',
          sender_id:'',
          receiver_id: this.receiverUser['_id'],
          image: this.image
        } 
        this.chatService.sendMsg(obj);
      }
  }    

  proFilePic(val){
    console.log("===val===>", val);
    // console.log("===>this.chatService.currentUser.....>>>>>", this.chatService.currentUser);
    if(val=='self'){
      let pic = (this.chatService.currentUser['profile_pic'])?(!this.chatService.currentUser['profile_pic'].includes('https'))?(this.chatService.baseUrl + this.chatService.currentUser['profile_pic']):(this.chatService.currentUser['profile_pic']):('assets/img/profile/default_user.png');
      // console.log("======>>>>>>>>>>>>>>>>>>>>>>>",pic);
      return pic;
    }
    else{
      return (val.profile_pic)?(!val.profile_pic.includes('https'))?((val.profile_pic)?this.chatService.baseUrl + val.profile_pic:'assets/img/profile/default_user.png'):val.profile_pic:'assets/img/profile/default_user.png';
    }
  }









  // loadResources() { //isInitiator = true, location.hash === '#init'  //isInitiator: boolean = true
  //   this.error = '';
  //   this.info = '';
  //   let myVideo = this.myVideo;
  //   let otherUserVideo = this.otherUserVideo;
  //   //let peerx: any;
  //   let that = this;
  //   //this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
  //   //this.n.getUserMedia({ video: true, audio: false }, function (stream) {
  //   var browser = <any>navigator;
  //   browser.getUserMedia = (browser.getUserMedia ||
  //     browser.webkitGetUserMedia ||
  //     browser.mozGetUserMedia ||
  //     browser.msGetUserMedia);

    
  //   browser.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => { 
  //     console.log("Inside getUserMedia ->", SimplePeer);
  //     //peerx = new SimplePeer({
  //     that.peer = new SimplePeer({
  //       //that.peer = new Peer({

  //       initiator: that.isInitiator,
  //       stream: stream,
  //       reconnectTimer: 3000,
  //       iceTransportPolicy: 'any',// 'relay',any
  //       trickle: false,
  //       config: {
  //         iceServers: [
  //           {
  //             "urls": "stun:numb.viagenie.ca"
  //           },
  //           {
  //             "urls": "turn:numb.viagenie.ca",
  //             "username": "yanivmail2@gmail.com",
  //             "credential": "123456"
  //           }
  //         ]
  //       }

  //       //,
  //       //config: 
  //       //  {
  //       //    iceServers:
  //       //      that.myIceServers
  //       //  }
  //     });
  //     //console.log("peerx: " + peerx)
  //     console.log("peer: " + that.peer)
  //     //that.peer = peerx;


  //     //peerx.on('signal', function (data) {
  //     that.peer.on('signal', function (data) {

        
  //       if (that.isInitiator == false && data.renegotiate) {
  //         console.log("Renegotiate, wait to next round");
  //         return;
  //       }
  //       let person = that.isInitiator ? 'Caller' : 'Receiver';
  //       console.log('getting at last the signal id for' + person);
  //       let strData = JSON.stringify(data);
  //       console.log(strData);
  //       that.myPeerDetails = strData;
  //       // that.chatService.typeing({receiver_id: this.receiverUser['_id'], typeing_key: this.newMessage});
  //       that.chatService.vcall({receiver_id: that.receiverUser['_id'], vCallData: strData, name: that.chatService.currentUser['name']});
  //       //console.log('replace profile-level-id');
  //       //strData = strData.replace(/420029/g, "42e01f") //this is replace all in regular expression
  //       //strData = strData.replace(/42001f/g, "42e01f")
  //       //data = JSON.parse(strData);


        
        
        
        

  //     })

  //     //peerx.on('connect', function () {
  //     that.peer.on('connect', function () {
  //       console.log('You are connected!!!')
  //       that.info = "Connected!";
  //       that.myVideo.srcObject = stream; //https://stackoverflow.com/questions/49628595/capture-from-webcamera-html
  //       that.myVideo.play();
  //     })

  //     //peerx.on('error', function (f) {
  //     that.peer.on('error', function (f) {
  //       console.log('*****************************error in peer*****************************,' + f.message)
  //       that.error = f.message;
  //     })
  //     that.peer.on('close', function () {
  //       console.log('Close has been fired')
  //     })




  //     that.peer.on('data', function (data) { //Send text/binary data to the remote peer. data can be any of several types: String, Buffer
  //       //let str = data.toString('utf8');
  //       //console.log('Recieved message:' + data);
  //       //if (str == 'play') { //other user want to play his video
  //       //  //that.otherUserVideo.play();
  //       //  that.playVideoData(that.otherUserVideo);
  //       //}
  //       //else if (str == 'stop') { //other user want to stop his video
  //       //  that.stopVideoData(that.otherUserVideo);
  //       //}
  //     })

     

  //     //peerx.on('stream', function (stream) {
  //     that.peer.on('stream', function (stream) {
  //       //   if (stream.active) {
  //       this.lineNo = "432 Stream is " + stream.active;
  //       console.log("Stream is " + stream.active);
  //     //  if (stream.active) {
  //         //that.otherUserVideo.srcObject = null //added to fix chrome bug.
  //         that.otherUserVideo.srcObject = stream;
  //         that.otherUserVideo.play();
  //      // }
        
  //     })

    

     

  //   }).catch(err => {
  //     let friendlyError = '';
  //     console.log("Inside getUserMedia -2>", SimplePeer);
  //     console.log("Error video: " + err); //https://addpipe.com/blog/common-getusermedia-errors/
  //     /* handle the error */
  //     if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
  //       friendlyError = "Please check that your web camera is connected";
  //       //required track is missing
  //     } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
  //       friendlyError = "Your camera is already connected to another device or another browser, try again or check your camera device, sometimes disconnect and reconnect the camera can help";
  //       //webcam or mic are already in use
  //     } else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
  //       //constraints can not be satisfied by avb. devices
  //     } else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
  //       friendlyError = "Permission denied in browser, check your browser setting";
  //       //permission denied in browser
  //     } else if (err.name == "TypeError" || err.name == "TypeError") {
  //       //empty constraints object
  //       friendlyError = "Connection error in object, " + err.message;
  //     } else {
  //       //other errors
  //       friendlyError = "Connection error, " + err.message; //still need to raise the error and try again.
  //     }
  //     if (friendlyError != '') {
  //       console.log(friendlyError);
  //       that.error = friendlyError;
  //     }



  //     });

  // }

  // connect() {
  //   this.error = '';
  //   this.info = '';
  //   let otherPeerId = JSON.parse(this.otherUserPeerDetails);
  //   this.peer.signal(otherPeerId);
  // }

  peerIdShare: string;
  peerId:any;
  lazyStream:any;
  currentPeer:any;
  peerList: Array<any> = [];

  isCallOnGoing: boolean = false;
  isAudio: boolean = true;
  isVideo: boolean = true;

  getPerrId(){
    this.peer.on('open', (id)=>{
      console.log('-----getting------>', id)
      this.peerId = id;
    })

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: this.isVideo,
        audio: this.isAudio
      }).then((stream) => {
        this.lazyStream = stream;

        call.answer(stream);
        call.on('stream', (remoteStream) => {
          this.isCallOnGoing = true;
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });

      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    });


  }

  connectWithPeer(){
    this.callPeer(this.peerIdShare,{});
  }

  peerConnection:any ="";
  myvidTrack: any;
  callPeer(id: string, red: any){
    console.log("id====>", id);
    if(red){
      console.log("red====>", red);
    }  
    // this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: this.isVideo,
        audio: this.isAudio
      }).then((stream) => {
        this.lazyStream = stream;
        this.myvidTrack = stream.getVideoTracks();

        // call.answer(stream);
        const call = this.peer.call(id, stream);
        this.peerConnection = call;
        call.on('stream', (remoteStream) => {
          this.isCallOnGoing = true;
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });

      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    // });

  }

  streamRemoteVideo(stream: any){
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    document.getElementById('remote-video').append(video);

  }

  public calling($event) {    
    console.log("====this.peerId====>",this.peerId);
    console.log("------this.receiverUser----->",this.receiverUser);
    this.chatService.calling({receiver_id: this.receiverUser['_id'], peerId: this.peerId});
  }  

  public close(){
    this.peerConnection.call('close',(e)=>{
      console.log("=====e=====>",e)
    })
  }


  private shareScreen() {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      this.myvidTrack = stream.getVideoTracks();
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }

  stopVideoCall(){
    this.myvidTrack.forEach(track => track.enabled = false);
  }

}