//  initRemote() {
//         // getHupuWs()
//         let isRunning = false
//         getHupuWS((hupuWsUrl) => {
//             let remoteIO = io.connect(hupuWsUrl);
//             let setPlayer = (leftPlayer, rightPlayer) => {
//                 console.log(leftPlayer)
//                 // player level 0 其他 1 至少一个胜场  2 大师赛 3冠军
//                 this.scorePanel.setLeftPlayerInfo(leftPlayer.name, leftPlayer.avatar, leftPlayer.weight, leftPlayer.height, leftPlayer.groupId, leftPlayer.level, leftPlayer.rankingData)
//                 this.scorePanel.setRightPlayerInfo(rightPlayer.name, rightPlayer.avatar, rightPlayer.weight, rightPlayer.height, rightPlayer.groupId, rightPlayer.level, rightPlayer.rankingData)
//             };
//             let gameId = getUrlQuerys('gameId')
//             remoteIO.on('connect', () => {
//                 console.log('hupuAuto socket connected', hupuWsUrl);
//                 remoteIO.emit('passerbyking', {
//                     game_id: gameId,
//                     page: 'score'
//                 })

//                 TweenEx.delayedCall(2500, () => {
//                     if (!isRunning)
//                         this.initDefaultPlayer()
//                 });
//             });

//             remoteIO.on('wall', (data: any) => {
//                 let event = data.et;
//                 let eventMap = {};
//                 console.log('event:', event, data);

//                 eventMap['init'] = () => {
//                     console.log("eventMap['init']", data);
//                     logEvent('init', data);
//                     this.scorePanel.set35ScoreLight(data.winScore);
//                     this.scorePanel.setGameIdx(Number(data.gameIdx), Number(data.matchType));
//                     setPlayer(data.player.left, data.player.right);
//                     this.scorePanel.setLeftScore(data.player.left.leftScore);
//                     this.scorePanel.setRightScore(data.player.right.rightScore);
//                     this.scorePanel.setLeftFoul(data.player.left.leftFoul);
//                     this.scorePanel.setRightFoul(data.player.right.rightFoul);
//                     data.delayTimeMS = this.delayTimeMS

//                     let gameStatus = Number(data.status)
//                     if (data.status == 0) {//status字段吧 0 进行中 1已结束 2 ready
//                         let gameTime = Math.floor(data.t / 1000 - Number(data.st))
//                         this.scorePanel.setTimer(gameTime)
//                         this.scorePanel.toggleTimer(TimerState.RUNNING);
//                     }
//                     else if (data.status == 2) {
//                         this.scorePanel.toggleTimer(TimerState.PAUSE);
//                         this.scorePanel.resetTimer();
//                     }
//                     // if (gameTime > 0)
//                     //     this.scorePanel.toggleTimer(TimerState.RUNNING)
//                     // this.emit('init', data)
//                     //setup timer
//                     // console.log('$opView', this.$opView);
//                     // this.$opView.setSrvTime(data.t);

//                     // this.$opView.liveTime = DateFormat(new Date(this.srvTime), "hh:mm:ss");


//                     //test
//                     // this.eventPanel.playerInfoCard.fadeInWinPlayer(true, data.player.left);
//                     // this.eventPanel.playerInfoCard.fadeInWinPlayer(false, data.player.right);
//                     // this.scorePanel.resetTimer();
//                     // this.scorePanel.toggleTimer1(TimerState.RUNNING);
//                     // Tween.get(this).wait(3000).call(()=> {
//                     //     this.scorePanel.toggleTimer1(TimerState.PAUSE);
//                     // });
//                     // this.scorePanel.setRightFoul(3)
//                     // this.scorePanel.setLeftFoul(4)

//                 };

//                 eventMap['updateScore'] = () => {
//                     console.log('updateScore', data);
//                     logEvent('updateScore', data);
//                     if (data.leftScore != null)
//                         this.scorePanel.setLeftScore(data.leftScore);
//                     if (data.rightScore != null)
//                         this.scorePanel.setRightScore(data.rightScore);
//                     if (data.rightFoul != null)
//                         this.scorePanel.setRightFoul(data.rightFoul);
//                     if (data.leftFoul != null)
//                         this.scorePanel.setLeftFoul(data.leftFoul);
//                 };

//                 eventMap['timeStart'] = () => {
//                     console.log('timeStart', data);
//                     this.scorePanel.toggleTimer(TimerState.RUNNING);
//                 }
//                 eventMap['startGame'] = () => {
//                     console.log('startGame', data);
//                     logEvent('startGame', data)
//                     this.scorePanel.set35ScoreLight(data.winScore);
//                     this.scorePanel.setGameIdx(data.gameIdx, Number(data.matchType));
//                     setPlayer(data.player.left, data.player.right);
//                     // window.location.reload();
//                     this.scorePanel.toggleTimer(TimerState.PAUSE);
//                     this.scorePanel.resetScore();
//                     this.scorePanel.resetTimer();
//                 };

//                 eventMap['commitGame'] = () => {
//                     console.log('commitGame', data)
//                     logEvent('commitGame', data)
//                     let player = data.player

//                     this.eventPanel.showWin(player)
//                     this.scorePanel.toggleTimer(TimerState.PAUSE);
//                 };
//                 if (eventMap[event]) {
//                     isRunning = true
//                     let d = this.delayTimeMS;
//                     logEvent(event, 'delay', d, data)
//                     if (event == 'init')
//                         d = 0
//                     // this.emit(event, data)
//                     TweenEx.delayedCall(d, () => {
//                         eventMap[event]();
//                     });
//                 }
//             });
//         })
//     }