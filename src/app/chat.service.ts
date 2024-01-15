import { Injectable,EventEmitter } from '@angular/core';
import {HubConnection,HubConnectionBuilder, Subject} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection: HubConnection;
  onMessageReceived: EventEmitter<{ user: string; message: string }>=new EventEmitter();
  messageReceived = new Subject<{ user: string; message: string }>();
  constructor() {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7212/chathub').build(); // use the same endpoint as defined in the backup;
   }

   startConnection(){
    this.hubConnection.start().then(()=>{
      console.log('Connection Started');
      this.registerOnServerEvents();
    })
    .catch(err => console.log('Error while starting connection: '+ err));
   }
   sendMessage(message:string){
    this.hubConnection.invoke('SendMessage',message);
   }
   joinSpecificChatRoom(username:string,chatroom:string){
    this.hubConnection.invoke("JoinSpecificChatRoom",{username,chatroom});
   }
   private registerOnServerEvents():void{
    this.hubConnection.on('ReceiveSpecificMessage',(user: string, message: string) => {
      this.messageReceived.next({ user, message });
      this.onMessageReceived.emit({user,message});
    });
    this.hubConnection.on('JoinSpecificChatRoom',(user: string, message: string) => {
      this.messageReceived.next({ user, message });
      this.onMessageReceived.emit({user,message});
    });
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.messageReceived.next({ user, message });
      this.onMessageReceived.emit({user,message});
    });
   }
}
