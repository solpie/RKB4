import os
# print(os.path.realpath(__file__))
# server_path = os.path.realpath(__file__)
serverConf = {"port": 80, "path": '.', 'index': None,
              "debug": False,'dbPath':''}

serverConf["path"] = os.path.dirname(__file__)
if serverConf["path"] == "":
    serverConf["path"] = os.path.realpath(".")
print("server root:", serverConf["path"])
# config
import configparser

config = configparser.RawConfigParser()


def loadConf():
    config.read(os.path.join(serverConf["path"], '.cfg'))
    serverConf["port"] = config.get('server', 'port')
    serverConf["dbPath"] = config.get('server', 'dbPath')
    serverConf["index"] = config.get('server', 'index')
    serverConf["debug"] = (config.get('server', 'debug') == 'true')
    print("serverConf:", serverConf)

loadConf()

# web server
import socketio
import eventlet
import eventlet.wsgi
from flask import Flask, render_template, redirect
from flask_socketio import SocketIO
if serverConf["debug"]:
    app = Flask(__name__, static_folder='./../../dist/static',
                static_url_path='/static')
else:
    app = Flask(__name__, static_folder='./static', static_url_path='/static')
sio = socketio.Server()


@app.route('/')
def index():
    if serverConf["index"]:
        return redirect('/' + serverConf["index"])
    else:
        return 'running'


@app.route('/<view>/')
def onView(view):
    return '''
<script src="/static/views/{0}.js"></script>
    '''.format(view)


@sio.on('connect', namespace='/ws')
def connect(sid, environ):
    print("connect ", sid)


@sio.on('event', namespace='/ws')
def message(sid, data):
    print("event ", data)
    sio.emit('reply', room=sid)


@sio.on('disconnect', namespace='/ws')
def disconnect(sid):
    print('disconnect ', sid)
# rawDay
from rawDay import setup
setup(app, sio)
if __name__ == '__main__':
    if serverConf["debug"]:
        devSrv = SocketIO(app, async_mode='eventlet')
        devSrv.run(app, host='0.0.0.0', port=int(
            serverConf["port"]), debug=True)
    else:
        # wrap Flask application with engineio's middleware
        appMiddleware = socketio.Middleware(sio, app)
        # deploy as an eventlet WSGI server
        eventlet.wsgi.server(eventlet.listen(
            ('', int(serverConf["port"]))), appMiddleware, debug=False)
