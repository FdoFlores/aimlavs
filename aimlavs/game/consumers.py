import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import random

class ChatConsumer(WebsocketConsumer):
    def get_color(self):
        red = random.randint(0, 255)
        green = random.randint(0, 255)
        blue = random.randint(0, 255)
        
        # Format the RGB values into a string
        rgb_string = 'rgb({}, {}, {})'.format(red, green, blue)
        
        return rgb_string

    def connect(self):
        self.room_group_name = 'test'
        self.username = f'user: {random.randint(1, 100)}'
        self.color = self.get_color()
        print(self.color)
        self.accept()

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'user_log',
                'user': self.username,
                'color': self.color,
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'target',
                'coords': [random.randint(0,300),random.randint(0,300)]
            }
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if 'message' in text_data_json:
            message = text_data_json['message']
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message':message
                }
            )
        elif 'x_pos' in text_data_json:
            x_pos = text_data_json['x_pos']
            y_pos = text_data_json['y_pos']
            user = text_data_json['user']
            color = text_data_json['color']
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'm_move',
                    'x_pos': x_pos,
                    'y_pos': y_pos,
                    'user': user,
                    'color': color
                }
            )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type':'chat',
            'message': message
        }))

    def m_move(self, event):
        x_pos = event['x_pos']
        y_pos = event['y_pos']
        user = event['user']
        color = event['color']

        self.send(text_data=json.dumps({
            'type':'m_move_r',
            'x_pos': x_pos,
            'y_pos': y_pos,
            'user': user,
            'color': color
        }))

    def user_log(self, event):
        user = event['user']
        color = event['color']
        self.send(text_data=json.dumps({
            'type': 'user_log',
            'user': user,
            'color': color
        }))

    def target(self, event):
        coords = event['coords']
        self.send(text_data=json.dumps({
            'type': 'target',
            'coords': coords
        }))