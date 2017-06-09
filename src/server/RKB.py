import os
# print(os.path.realpath(__file__))
# server_path = os.path.realpath(__file__)
serverConf = {"port": 80, "path": '.', 'index': None,
              "debug": False}

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
    serverConf["index"] = config.get('server', 'index')
    serverConf["debug"] = (config.get('server', 'debug') == 'true')
    print("serverConf:", serverConf)

loadConf()

# web server
from flask import Flask, request, redirect
from flask_socketio import SocketIO

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
from engineio import async_eventlet
async_mode = "eventlet"
if serverConf["debug"]:
    app = Flask(__name__, static_folder='./../../dist',
                static_url_path='/static')
else:
    app = Flask(__name__, static_folder='./dist', static_url_path='/static')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)


@app.route('/')
def index():
    if serverConf["index"]:
        return redirect('/'+serverConf["index"])
    else:
        return 'running'


@app.route('/<view>/')
def onView(view):
    return '''
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
</head>

<body>
    <div id="app"></div>
<script type="text/javascript" src="/static/{0}.js"></script>
</body>
</html>
    '''.format(view)

if __name__ == '__main__':
    socketio.run(app, port=int(serverConf["port"]), debug=serverConf["debug"])
