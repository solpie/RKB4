import os
# print(os.path.realpath(__file__))
# server_path = os.path.realpath(__file__)
serverConf = {"port": 80, "path": '.', 'index': None,
              "debug": False, 'dbPath': ''}

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
    serverConf["reqHeaders"] = str(
        config.get('server', 'reqHeaders')).split(",")
    serverConf["resHeaders"] = str(
        config.get('server', 'resHeaders')).split(",")
    serverConf["index"] = config.get('server', 'index')
    serverConf["debug"] = (config.get('server', 'debug') == 'true')
    print("serverConf:", serverConf)

loadConf()

# web server
import socketio
import eventlet
from flask import Flask, render_template, redirect, request, make_response, jsonify
from flask_socketio import SocketIO, emit
if serverConf["debug"]:
    app = Flask(__name__, static_folder='./../../dist/static',
                static_url_path='')
else:
    app = Flask(__name__, static_folder='./static', static_url_path='/static')
sio = SocketIO(app, async_mode='eventlet')

app.config['SECRET_KEY'] = 'secret!'


@app.route('/')
def index():
    if serverConf["index"]:
        return redirect('/' + serverConf["index"])
    else:
        return 'running'


@app.route('/<view>/')
def onView(view):
    if serverConf['debug']:
        return redirect('/dev/' + view + '.html')
    else:
        return '''
<script src="/static/views/{0}.js"></script>
    '''.format(view)
import requests
import base64


@app.route('/proxy', methods=['GET', 'POST'])
def proxy():
    req_headers = dict()
    for h in serverConf["reqHeaders"]:
        req_headers[h] = request.headers[h]
    url = ""
    if request.method == "GET":
        url = request.args.get('url', '')
        r = requests.get(url, headers=req_headers)
        res = make_response(r.content)
    # if request.method == "POST":
    #     r = requests.post(url, headers=req_headers)

        res_headers = dict()
        for h in serverConf["resHeaders"]:
            res_headers[h] = r.headers[h]

        if 'image' in res_headers["Content-Type"]:
            encoded_string = b"data:image/png;base64," + \
                base64.b64encode(r.content)
            return encoded_string

        res.headers = res_headers
        return res

    if request.method == "POST":
        url = request.values.get("url")
        print(request.json)
        r = requests.post(url, request.json)
        if r.headers['Content-Type'].find('json') > -1:
            c = r.json()
        else:
            c = r.text
        return jsonify({'Content-Type': r.headers['Content-Type'], 'content': c})


@app.route('/emit/<cmd>', methods=['POST'])
def emitCmd(cmd):
    print(cmd, request.json)
    if '_' in request.json:
        if 'prefix' in request.json:
            emit(cmd.replace('cs_', request.json['prefix']), request.json,
                 broadcast=True, namespace=ns)
        else:
            emit(cmd.replace('cs_', 'sc_'), request.json,
                 broadcast=True, namespace=ns)
    return 'ok'

ns = '/rkb'

# @sio.on('connect')
# def connect(sid, environ):
#     print("connect ", sid)

# @sio.on('disconnect')
# def disconnect(sid):
#     print('disconnect ', sid)


@sio.on('connect', namespace=ns)
def connect(sid, environ):
    print("connect ", sid)


@sio.on('disconnect', namespace=ns)
def disconnect(sid):
    print('disconnect ', sid)
# rawDay
# from rawDay import setup
# setup(app, sio)
if __name__ == '__main__':
    sio.run(app, host='0.0.0.0', engineio_logger=True, port=int(
        serverConf["port"]), debug=serverConf["debug"])
