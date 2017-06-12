from flask import Blueprint, jsonify, request
rawDayView = Blueprint('rawDayView', __name__)

ns = '/livedata'
from flask_socketio import emit


def rawDayViewInitWS(socketio):
    @socketio.on('connect', namespace=ns)
    def _connect():
        emit('clientCon', broadcast=True, namespace=ns)
        print('liveDataView connected')

    @socketio.on('disconnect', namespace=ns)
    def _disconnect():
        print('liveDataView disconnected', request.sid)

    @socketio.on('start', namespace=ns)
    def onStart(data=None):
        emit('cs_start', data, broadcast=True,
             namespace=ns, include_self=False)
        print('liveData [Event] start', data)

    @socketio.on('push', namespace=ns)
    def onPush(data=None):
        emit('cs_push', data, broadcast=True, namespace=ns, include_self=False)
        print('liveData [Event] push')

    @socketio.on('commit', namespace=ns)
    def onCommit(data=None):
        emit('cs_commit', data, broadcast=True,
             namespace=ns, include_self=False)
        print('liveData [Event] commit')

    @socketio.on('fallback', namespace=ns)
    def onFallback(data=None):
        emit('cs_fallback', data, broadcast=True,
             namespace=ns, include_self=False)
        print('liveData [Event] fallback')

    @socketio.on('drop', namespace=ns)
    def onDrop(data=None):
        emit('cs_drop', data,
             broadcast=True, namespace=ns, include_self=False)
        print('liveData [Event] drop')


def setup(app, socketio):
    rawDayViewInitWS(socketio)
    app.register_blueprint(rawDayView, url_prefix='/rd')

from jsonDB import BaseDB


class rawDayDB(object):

    def __init__(self):
        self.db = BaseDB('./db/rawDayDB.db')

rd = rawDayDB()


@rawDayView.route('/cmd/<cmd>', methods=['POST'])
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


@rawDayView.route('/find/<idx>', methods=['GET'])
def findDoc(idx):
    doc = rd.db.find({'id': int(idx)})
    return jsonify(doc)


@rawDayView.route('/update/<idx>', methods=['POST'])
def udpateDoc(idx):
    newDoc = request.json
    doc = rd.db.find({'id': int(idx)})
    if doc:
        rd.db.update(newDoc)
    else:
        rd.db.insert(newDoc)
    return 'ok'
