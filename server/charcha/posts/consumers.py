import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import Post, Likes, Categories
from datetime import datetime
from .serializers import PostSerializer

class PostsConsumer(AsyncWebsocketConsumer):
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
        text_data_json = json.loads(text_data)
        post_val = text_data_json["post"]
        username=text_data_json["username"]

        result = await self.save_message(username, post_val)

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
        # Send message to room group
        # await self.channel_layer.group_send(
        #     self.room_group_name, {"type": "chat.message", "message": post_val}
        # )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))


    @database_sync_to_async
    def save_message(self,username,post_val):
        try:
            print("hi1", username)
            user=User.objects.get(username=username)
            print("hi2", user)
            postObj= Post.objects.create(
                username=user,
                post_val=post_val,
                sent_time=datetime.now().strftime("%d/%m/%Y:%H:%M:%S")
            )
            print("hi3")
            post=PostSerializer(postObj).data
            print("hi4")
            return {"status": "success", "message":post}
        except User.DoesNotExist:
            return {"status": "error", "message": "User does not exist"}
        except:
            return {"status":"error","message":"something unexpected occurred"}
