import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Friend,Message
from django.contrib.auth.models import User
from datetime import datetime
from .serializers import MessageSerializer
import logging

logger=logging.getLogger(__name__)

class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_val = text_data_json["message"]
            username=text_data_json["username"]
            friendname=text_data_json["friendname"]

            result=await self.save_message(username,friendname,message_val)

            if result["status"]=="error":
                await self.send(text_data=json.dumps({
                    "error":result["message"]
                }))
            else:
                await self.channel_layer.group_send(
                self.room_group_name, 
                {
                    "type": "chat.message",
                    "message":result["message"]
                })
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            await self.send(text_data=json.dumps({"error": "An error occurred"}))
       
        # Send message to room group
       
    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def save_message(self,username,friendname,message_val):
        try:
            user=User.objects.get(username=username)
            friend=User.objects.get(username=friendname)
            messageObj= Message.objects.create(
                username=user,
                friendname=friend,
                message_val=message_val,
                sent_time=datetime.now().strftime("%d/%m/%Y:%H:%M:%S")
            )
            message=MessageSerializer(messageObj).data
            return {"status": "success", "message":message}
        except User.DoesNotExist:
            return {"status": "error", "message": "One or both users do not exist"}
        except:
            return {"status":"error","message":"something unexpected occurred"}


