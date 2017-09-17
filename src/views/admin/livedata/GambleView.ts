import { $post } from '../../utils/WebJsFunc';
export class GambleView {
    topicIdArr = []
    startGamble(roomId, left, right) {
        $post('/autoGamble/start', { roomId: roomId, leftPlayer: left, rightPlayer: right })
    }
}