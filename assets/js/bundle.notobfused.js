document.persistentToast = null

$('#year').text(new Date().getFullYear())

const PersistentToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 0
})

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

function makeid(length) {
    var result           = '';
    var characters       = 'abcde0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function randomUID() {
    // 053d44dd-430c-4e4b-9a2a-95e0e1614856
    return `${makeid(8)}-${makeid(4)}-${makeid(4)}-${makeid(4)}-${makeid(12)}`
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }
  
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function filterHandle() {
    $("#search-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#qna .answer").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}

function appendQNA(data) {
    $('#qna').html('')
    let htmlHeader = `
        <hr>
        <div id="header-qna">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="card-header">
                                <h3>${data.name}</h3>
                            </div>
                            ${data.image ? `<div class="card-body"><img src="${data.image}" class="card-img-top embed-responsive-item"></div>` : ''}
                            <div class="card-footer text-muted card-img-top">
                                <div class="float-start">
                                    ${data.createdBy.firstName} ${data.createdBy.lastName}
                                </div>
                                <div class="float-end">
                                    ${data.subjects.join(', ')} ${data.grade}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="search-content">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon1">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input id="search-input" type="text" class="form-control" placeholder="Filter Question or Answer" aria-label="Pin" value="" aria-describedby="basic-addon1" style="font-family: monospace;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $('#qna').append(htmlHeader)
    for (let questions of data.questions) {
        let html = `
        <div class="answer" id="answers">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="card-header">
                                <div class="float-start">
                                    ${questions.type}
                                </div>
                                <div class="float-end">
                                    ${msToTime(questions.time)}
                                </div>
                            </div>
                            <div class="card-body">
                                ${questions.media.length > 0 ? questions.media[0].type == 'image' ? `<img src="${questions.media[0].url}" class="card-img-top embed-responsive-item">` :  questions.media[0].type == 'audio' ? `<audio controls><source src="${questions.media[0].url}" type="audio/mpeg"></audio>` : '' : ``}
                                <p>${questions.question}</p>
                                <div class="row d-flex p-2 bd-highlight">`
                                for (let option of questions.options) {
                                    if (option.isCorrect) {
                                        html += `
                                        <div class="mb-3 d-flex justify-content-center align-items-center rounded bg-success text-white" style="height: 100px;">
                                            ${option.media.length > 0 ? `<img src="${option.media[0].url}" height="90px">` : `<span>${option.text}</span>`}
                                        </div>`
                                    } else {
                                        html += `
                                        <div class="mb-3 d-flex justify-content-center align-items-center rounded bg-danger text-white" style="height: 100px;">
                                            ${option.media.length > 0 ? `<img src="${option.media[0].url}" height="90px">` : `<span>${option.text}</span>`}
                                        </div>`
                                    }
                                }
                            html += `
                            </div>
                            <div class="card-footer text-muted card-img-top">
                                Explanation : ${data.explain || '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` 
        $('#qna').append(html)
        filterHandle()
    }
}

function parseQuizizz() {
    let pinurl = $('#_data').val()
    if (pinurl.includes('quizizz.com') && !pinurl.includes('join?gc')) {
        document.persistentToast = PersistentToast.fire(
            'Processing...',
            'Crawling URL Request.',
            'info'
        )
        let id = pinurl.match(/[a-z0-9]{24}/g)[0]
        let apiUrl = `/getMetadata?id=${id}`
        let data = {
            questions: []
        }
        $.getJSON(apiUrl, (json) => {
            if (json.error) {
                Toast.fire(
                    'Cannot fetch Quiz',
                    json.message,
                    'warning'
                )
                return
            }
            let questionsInfo = json.data.quiz.info
            data.updatedAt = questionsInfo.updated
            data.grade = questionsInfo.grade == questionsInfo.grade ? questionsInfo.grade[0] : questionsInfo.grade[0] + '-' + questionsInfo.grade[1]
            data.subjects = questionsInfo.subjects
            data.name = questionsInfo.name
            data.image = questionsInfo.image
            data.createdBy = json.data.quiz.createdBy
            for (let questionItem of questionsInfo.questions) {
                let options = []
                for (let i = 0; i < questionItem.structure.options.length; i++) {
                    const option = questionItem.structure.options[i]
                    options.push({
                        type: option.type,
                        text: `${option.text}`.replace(/\<p\>/g, ''),
                        media: option.media,
                        isCorrect: questionItem.structure.answer.toString().includes(i) || questionItem.type == 'BLANK'
                    })
                }
                data.questions.push({
                    type: questionItem.type,
                    question: questionItem.structure.query.text.replace(/\<p\>/g, ''),
                    explain: questionItem.structure.explain ? questionItem.structure.explain.text : '',
                    time: questionItem.time,
                    media: questionItem.structure.query.media,
                    options
                })
            }
            console.log(data)
            document.persistentToast.close()
            appendQNA(data)
            Toast.fire(
                'Success',
                `Success Scraping Answers!`,
                'success'
            )
        })
        .fail(function() {
            Toast.fire(
                'Failed!',
                'Cannot find data on that url.',
                'warning'
            )
        })
    } else if (pinurl.includes('join?gc')) {
        document.persistentToast = PersistentToast.fire(
            'Processing...',
            'Crawling PIN Request.',
            'info'
        )
        let pin = pinurl.match(/[0-9]/g).join('')
        $.getJSON('/checkRoom?pin=' + pin, (json) => {
            console.log(json)
            if (json.room) {
                document.persistentToast = PersistentToast.fire(
                    'Socketing...',
                    `Connecting to socket`,
                    'info'
                )
                processLiveFromHash(json.room.hash)
            } else {
                Toast.fire(
                    'Code Error!',
                    json.error.message,
                    'warning'
                )
            }
        })
    } else if (/^\d+$/.test(pinurl)) {
        document.persistentToast = PersistentToast.fire(
            'Processing...',
            'Crawling PIN Request.',
            'info'
        )
        $.getJSON('/checkRoom?pin=' + pinurl, (json) => {
            console.log(json)
            if (json.room) {
                document.persistentToast = PersistentToast.fire(
                    'Socketing ...',
                    `Connecting to socket`,
                    'info'
                )
                processLiveFromHash(json.room.hash)
            } else {
                Toast.fire(
                    'Code Error!',
                    json.error.message,
                    'warning'
                )
            }
        })
    } else {
        Toast.fire(
            'Failed!',
            'Please input valid URL or PIN!',
            'warning'
        )
    }
}

function processLiveFromHash(hash) {
    // let hash = '6330f2c3fdd348001e73c5fc'
    let player = faker.name.findName()
    let ua = ''
    $.get("/randomUA", function (data) {
        ua = data        
    });
    let joinString = `420["v5/join",{"roomHash":"${hash}","player":{"id":"${player}","origin":"web","isGoogleAuth":false,"avatarId":13,"startSource":"gameCode.param","userAgent":"${ua}","uid":"${randomUID()}","expName":"main_main","expSlot":"9"},"powerupInternalVersion":"19","__cid__":"v5/join.|1.${Date.now()}"}]`
    let socket = new WebSocket("wss://socket.quizizz.com/_gsocket/sockUpg/?experiment=authRevamp&EIO=4&transport=websocket");
    
    socket.onopen = function () {
        console.log('Socket Connected')
    };
    
    socket.onmessage = function (event) {
        const body = event.data
        // console.log(body)
        if (/^0/.test(body)) {
            socket.send("40"); // Login socket
            Toast.fire(
                'Parsing...',
                'Login to socket',
                'info'
            )
        } else if (/^40/.test(body)) {
            socket.send(joinString) // Get metadata
            Toast.fire(
                'Parsing...',
                'Joining game',
                'info'
            )
        } else if (/^2/.test(body)) {
            socket.send("3") // Pong
        } else if (/^42/.test(body)) {
            const result = JSON.parse(body.match(/\[.*?\]$/g)[0] ?? { "success":false })
            console.log(result)
            if (result[0].includes('join') && result[1].room) {
                if (result[1].room.type == 'test') {
                    let data = result[1].room
                    $.getJSON(`/getInfo?hash=${data.hash}`, (json) => {
                        data.grade = json.data.grade == json.data.grade ? json.data.grade[0] : json.data.grade[0] + '-' + json.data.grade[1]
                        data.image = json.data.image
                        data.subjects = json.data.subjects
                        console.log({data})
                        appendLiveTestQNA(data)
                        Swal.fire(
                            'Information',
                            'For Test Question, We don\'t offer answers, but we show questions and raw answers for you!',
                            'info'
                        )
                    })
                } else {
                    let roomData = { ...result[1].room, playerId: player }
                    document.waitRoom = roomData
                    if (result[1].room.state == 'waiting') {
                        document.persistentToast = PersistentToast.fire(
                            `Quizziz Live - ${result[1].room.name}`,
                            'Waiting For Start Quiz...',
                            'info'
                        )
                        $('#qna').html('')
                        parseLiveQuizizz(roomData)
                    } else {
                        parseLiveQuizizz(roomData, true)
                    }
                }
            } else if (result[0].includes('handshakeData')) {
                Toast.fire(
                    'Status Changed',
                    'Received Handshake!',
                    'info'
                )
            } else if (result[0].includes('gameStarted')) {
                Toast.fire(
                    'Status Changed',
                    'Game Started!',
                    'info'
                )
                parseLiveQuizizz(document.waitRoom, true)
            } else if (result[0].includes('pauseGame')) {
                Toast.fire(
                    'Status Changed',
                    'Game Paused!',
                    'info'
                )
            } else if (result[0].includes('gameEnded')) {
                Swal.fire(
                    'Status Changed',
                    'Game Ended by Host!',
                    'info'
                )
                socket.close(1000)
            } else if (!result[0].includes('handshakeData') && !result[1].room) {
                Swal.fire(
                    'Cannot access live!',
                    'Make sure you have logged out from quizizz website!',
                    'warning'
                )
                socket.close(1000)
            }
        }
    };
    
    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
    };
}

function appendLiveQNA(data) {
    $('#qna').html('')
    let htmlHeader = `
        <hr>
        <div id="header-qna">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="card-header">
                                <input type="hidden" id="roomHash" value="${data.hash}">
                                <h3>${data.name}</h3>
                            </div>
                            ${data.image ? `<div class="card-body"><img src="${data.image}" class="card-img-top embed-responsive-item"></div>` : ''}
                            <div class="card-footer text-muted card-img-top">
                                <div class="float-start">
                                    GRADE : ${data.grade}
                                </div>
                                <div class="float-end">
                                    ${data.subjects.join(', ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="search-content">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon1">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input id="search-input" type="text" class="form-control" placeholder="Filter Question or Answer" aria-label="Pin" value="" aria-describedby="basic-addon1" style="font-family: monospace;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $('#qna').append(htmlHeader)
    for (let id of data.questionIds) {
        let questions = data.questions[id]
        let html = `
        <div class="answer" id="${id}">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="card-header">
                                <div class="float-start">
                                    ${questions.type}
                                </div>
                                <div class="float-end">
                                    ${msToTime(questions.time)}
                                </div>
                                <div id="qna-${id}">
                                    <input type="hidden" id="type" value="${questions.type}">
                                    <input type="hidden" id="time" value="${questions.time}">
                                </div>
                            </div>
                            <div class="card-body">
                                <img ${questions.structure.query.media.length > 0 ? `src="${questions.structure.query.media[0].url}"` : 'style="display: none;"'} class="img-question">
                                <p>${questions.structure.query.text}</p>
                                <div class="row d-flex p-2 bd-highlight">
                                <center><img class="answer-load" src="assets/images/loading.gif"></center>`
                                let counter = 0;
                                for (let option of questions.structure.options ? questions.structure.options : []) {
                                    html += `
                                    <div id="${id}-${counter}" class="mb-3 d-flex justify-content-center align-items-center rounded bg-danger text-white" style="height: 100px; display: none !important;">
                                        ${option.media.length > 0 ? `<img src="${option.media[0].url}" height="90px">` : `<span>${option.text}</span>`}
                                    </div>`
                                    counter += 1
                                }
                            html += `</div>
                            <div class="card-footer text-muted card-img-top">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` 
        $('#qna').append(html)
        filterHandle()
    }
}


function appendLiveTestQNA(data) {
    $('#qna').html('')
    let htmlHeader = `
        <hr>
        <div id="header-qna">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="card-header">
                                <h3>${data.name}</h3>
                            </div>
                            ${data.image ? `<div class="card-body"><img src="${data.image}" class="card-img-top embed-responsive-item"></div>` : ''}
                            <div class="card-footer text-muted card-img-top">
                                <div class="float-start">
                                    GRADE : ${data.grade}
                                </div>
                                <div class="float-end">
                                    ${data.subjects.join(', ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="search-content">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon1">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input id="search-input" type="text" class="form-control" placeholder="Filter Question or Answer" aria-label="Pin" value="" aria-describedby="basic-addon1" style="font-family: monospace;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $('#qna').append(htmlHeader)
    for (let id of data.questionIds) {
        let questions = data.questions[id]
        let html = `
        <div class="answer" id="${id}">
            <div class="container-fluid bg-dark py-3">
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card text-center">
                            <div class="card-header">
                                <div class="float-start">
                                    ${questions.type}
                                </div>
                                <div class="float-end">
                                    ${msToTime(questions.time)}
                                </div>
                            </div>
                            <div class="card-body">
                                <img src="${questions.structure.query.media.length > 0 ? questions.structure.query.media[0].url : ''}" class="embed-responsive-item">
                                <p>${questions.structure.query.text}</p>
                                <div class="row d-flex p-2 bd-highlight">`
                                for (let option of questions.structure.options ? questions.structure.options : []) {
                                    html += `
                                    <div id="${id}" class="mb-3 d-flex justify-content-center align-items-center rounded border border-primary" style="height: 100px;">
                                        ${option.media.length > 0 ? `<img src="${option.media[0].url}" height="90px">` : `<span>${option.text}</span>`}
                                    </div>`
                                }
                            html += `</div>
                            <div class="card-footer text-muted card-img-top">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` 
        $('#qna').append(html)
        filterHandle()
    }
}

function parseLiveQuizizz(data, getAnswer=false) {
    console.log({ parseLive: data })
    $.getJSON(`/getInfo?hash=${data.hash}`, (json) => {
        data.grade = json.data.grade == json.data.grade ? json.data.grade[0] : json.data.grade[0] + '-' + json.data.grade[1]
        data.image = json.data.image
        data.subjects = json.data.subjects
        console.log(json)
        appendLiveQNA(data)
    })
    if (getAnswer) {    
        window.scrape_count = 1
        let length_question = data.questionIds.length
        for (let id of data.questionIds) {
            let questions = data.questions[id]
            let answerData =  {
                hash: data.hash,
                questionId: id,
                questionType: questions.type,
                time: questions.time,
                playerId: data.playerId
            }
            getLiveAnswer(answerData, length_question)            
        }
        Toast.fire(
            'Process',
            `Scraping Answers ..`,
            'info'
        )
    }
    // document.persistentToast.close()
}

function getLiveAnswer(data, length_question) {
    let response = null
    if (data.questionType == 'MCQ') {
        response = 0
    } else if (data.questionType == 'MSQ') {
        response = [0]
    } else if (data.questionType == 'BLANK') {
        response = {
            version: "2.0",
            text :"0",
            media:null
        }
    } else if (data.questionType == 'OPEN') {
        response = {
            version: "2.0",
            text :"0",
            media:null
        }
    }
    let postData = {
        hash: data.hash,
        player_id: data.playerId.toString(),
        question_id: data.questionId,
        question_type: data.questionType,
        time: randomIntFromInterval(0, data.time)
    }

    $.ajax({
        type: "GET",
        url: `/getAnswer?${$.param(postData)}`,
        success: function(res_data){
            let answer = res_data.question.structure.answer
            console.log({ data, answer })
            if (typeof answer === "number") {
                $('.answer-load').remove()
                $('.row.d-flex.p-2.bd-highlight > .rounded').show()
                $(`#${data.questionId}-${answer}`).removeClass('bg-danger')
                $(`#${data.questionId}-${answer}`).addClass('bg-success')
            } else if (typeof answer === "object" && Array.isArray(answer)) {
                $('.answer-load').remove()
                $('.row.d-flex.p-2.bd-highlight > .rounded').show()
                if (!res_data.question.structure.options) {
                    for (let index of answer) {
                        $(`#${data.questionId}-${index}`).removeClass('bg-danger')
                        $(`#${data.questionId}-${index}`).addClass('bg-success')
                    }
                } else {
                    for (let answer of res_data.question.structure.options) {
                        $(`#${data.questionId} .row.d-flex.p-2.bd-highlight`).append(`
                            <div id="answer-${data.questionId}" class="mb-3 d-flex justify-content-center align-items-center rounded bg-success text-white" style="height: 100px;">
                                ${answer.media.length > 0 ? `<img src="${answer.media[0].url}" height="90px">` : `<span>${answer.text}</span>`}
                            </div>
                        `)
                    }
                }
            } else if (typeof answer === "object" && answer.options) {
                $('.answer-load').remove()
                $('.row.d-flex.p-2.bd-highlight > .rounded').show()
                $(`#${data.questionId} .row.d-flex.p-2.bd-highlight`).append(`
                    <div id="answer-${id}" class="mb-3 d-flex justify-content-center align-items-center rounded bg-success text-white" style="height: 100px;">
                        ${answer.options.media.length > 0 ? `<img src="${answer.options.media[0].url}" height="90px">` : `<span>${answer.options.text}</span>`}
                    </div>
                `)
            }
            Toast.fire(
                'Quizziz Live',
                `Getting answers (${window.scrape_count}/${length_question})`,
                'info'
            )
            window.scrape_count += 1
            if (window.scrape_count === length_question) {
                Toast.fire(
                    'Quizziz Live',
                    `Success scraping all answers!`,
                    'success'
                )
            }
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}