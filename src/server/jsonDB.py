import json
from pprint import pprint

import string
import random


def _id_gen(size=7, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

import os


class BaseDB(object):
    __path = None
    __docMap = None

    def __init__(self, path):
        self.__docMap = {}
        self.__path = path
        if not os.path.exists(path):
            open(path, mode='w').close()
        else:
            self.__load()
            self.__flush()

    def __load(self):
        with open(self.__path, mode='r', encoding="utf-8") as f:
            for line in f:
                doc = json.loads(line, encoding="utf-8")
                self.__docMap[doc['_id']] = doc
        f.close()

    def insert(self, doc):
        _id = _id_gen()
        while _id in self.__docMap:
            _id = _id_gen()
        doc['_id'] = _id
        self.__docMap[_id] = doc
        self.__w(doc)
        # with open(self.__path, 'a', encoding="utf-8") as f:
        #     f.writelines(json.dumps(doc) + '\n')
        # f.close()

    def __w(self, doc):
        with open(self.__path, 'a', encoding="utf-8") as f:
            f.writelines(json.dumps(doc) + '\n')
        f.close()

    def reload(self):
        self.__load()

    def clear(self):
        self.__docMap = {}
        with open(self.__path, 'w', encoding="utf-8") as f:
            f.write('')
        f.close()

    def __flush(self, fromRemove=False):
        data = ""
        docNum = 0
        # pprint(self.__docMap)
        for _id in self.__docMap:
            doc = self.__docMap[_id]
            docLine = json.dumps(doc)
            data += docLine + '\n'
            docNum += 1
        if data != "" or fromRemove:
            with open(self.__path, mode='w', encoding="utf-8") as f:
                f.write(data)
            f.close()

    def update(self, doc):
        if doc['_id']:
            self.__docMap[doc['_id']] = doc
            self.__w(doc)
            self.__flush()
        else:
            print('update doc no _id', doc)

    def remove(self, query):
        r = []
        for k in query:
            v = query[k]
            for _id in self.__docMap:
                doc = self.__docMap[_id]
                if k in doc and v == doc[k]:
                    r.append(_id)
        print(self.__docMap)
        for _id in r:
            print('remove', _id)
            del self.__docMap[_id]
        print(self.__docMap)

        self.__flush(fromRemove=True)

    def find(self, query, update=None):
        docs = []
        for k in query:
            v = query[k]
            for _id in self.__docMap:
                doc = self.__docMap[_id]
                if k in doc and v == doc[k]:
                    if update:
                        for uKey in update:
                            doc[uKey] = update[uKey]
                    docs.append(self.__clone(doc))
        return docs

    def __clone(self, doc):
        return json.loads(json.dumps(doc))

    def findAll(self):
        docs = []
        for _id in self.__docMap:
            docs.append(self.__clone(self.__docMap[_id]))
        return docs

# bDb = BaseDB(".db")
# # test
# # doc = json.loads('{"test":1}')
# # bDb.insert(doc)
# # find
# docs = bDb.find({"test": 2})
# # update
# bDb.update({"test": 2}, {"name": 'curry'})
# # findAll
# docs = bDb.findAll()
# pprint(docs)

# bDb = BaseDB("player.db")
