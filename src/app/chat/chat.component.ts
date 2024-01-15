import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
messages:{user:string;message:string}[]=[];
newMessage:string="";
username:string="";
chatRoom:string="";
hasJoinedChatRoom: boolean = false;

constructor(private chatService:ChatService) {
  
}
ngOnInit(): void {
  this.chatService.startConnection();  
  this.chatService.onMessageReceived.subscribe((msg)=>{
    this.messages.push(msg);
  });
}
JoinChatRoom(){
  try{
    if(this.chatRoom !="" && this.username !=""){
      this.chatService.joinSpecificChatRoom(this.username,this.chatRoom);
      this.hasJoinedChatRoom =true;
    }
  }
  catch(err){
    console.log(err);
  }
}
sendMessage() {
  //alert(this.newMessage);
  if (this.newMessage) {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
}
