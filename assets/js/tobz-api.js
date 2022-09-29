function parseQuizizz() {
    var x = document.getElementById("form-code").elements[0].value;
    fetch('https://tobzapi.herokuapp.com/api/quizizz?q=' + x)
        .then(response => response.json())
        .then(result => {
            const arrLength = result.result.length
            for (var i = 0; i < arrLength; i++) {
                var divAnswer = document.createElement("div");
                divAnswer.id = "answers";
                var divContainer = document.createElement("div")
                divContainer.className = "container-fluid bg-light py-3"
                var divRow = document.createElement('div')
                divRow.className = "row"
                var divCol = document.createElement("div")
                divCol.className = "col-md-6 mx-auto"
                var card = document.createElement("div");
                card.className = "card text-center";
                card.style = "width: 18rem;";
                var cardHeader = document.createElement("div");
                cardHeader.className = "card-header";
                cardHeader.innerText = "Question & Answer"
                if (result.result[i].question?.image) {
                    for (let res_answer of result.result[i].answers) {
                        if (res_answer.image) {
                            var question = result.result[i].question.text
                            var newQuest = document.createElement("p");
                            newQuest.innerHTML = question;

                            var newAnswer = document.createElement("img")
                            newAnswer.className = "card-footer text-muted card-img-top"
                            newAnswer.src = res_answer.image
                            var imgAnswer = document.createElement("div")
                            imgAnswer.className = "img-answer"
                            var questImg = document.createElement("img");
                            questImg.className = "card-img-top";
                            questImg.alt = ""
                            questImg.src = result.result[i].question.image
                            var cardBody = document.createElement("div");
                            cardBody.className = "card-body"
                            cardBody.append(newQuest)

                            imgAnswer.append(newAnswer)
                            card.append(cardHeader, questImg, newQuest, cardBody, imgAnswer)
                            divCol.append(card)
                            divRow.append(divCol)
                            divContainer.append(divRow)
                            divAnswer.append(divContainer)
                            document.body.appendChild(divAnswer);
                        } else {
                            var question = result.result[i].question.text
                            var newQuest = document.createElement("p");
                            newQuest.innerHTML = question;

                            var newAnswer = document.createElement("span")
                            newAnswer.className = "card-footer text-muted card-img-top"
                            newAnswer.innerHTML = res_answer.text
                            var questImg = document.createElement("img");
                            questImg.className = "card-img-top";
                            questImg.alt = ""
                            questImg.src = result.result[i].question.image
                            var cardBody = document.createElement("div");
                            cardBody.className = "card-body"
                            cardBody.append(newQuest)

                            newAnswer.append()
                            card.append(cardHeader, questImg, newQuest, cardBody, newAnswer)
                            divCol.append(card)
                            divRow.append(divCol)
                            divContainer.append(divRow)
                            divAnswer.append(divContainer)
                            document.body.appendChild(divAnswer);
                        }
                    }
                } else {
                    for (let res_answer of result.result[i].answers) {
                        if (res_answer.image) {
                            var question = result.result[i].question.text
                            var newQuest = document.createElement("p");
                            newQuest.innerHTML = question;
                            var newAnswer = document.createElement("img")
                            newAnswer.className = "card-footer text-muted card-img-top"
                            newAnswer.src = res_answer.image
                            var imgAnswer = document.createElement("div")
                            imgAnswer.className = "img-answer"
                            var questImg = document.createElement("img");
                            questImg.className = "card-img-top";
                            questImg.alt = ""
                            questImg.src = result.result[i].question.image
                            var cardBody = document.createElement("div");
                            cardBody.className = "card-body"
                            cardBody.append(newQuest)
                            imgAnswer.append(newAnswer)
                            card.append(cardHeader, questImg, newQuest, cardBody, imgAnswer)
                            divCol.append(card)
                            divRow.append(divCol)
                            divContainer.append(divRow)
                            divAnswer.append(divContainer)
                            document.body.appendChild(divAnswer);
                        } else {
                            var question = result.result[i].question.text
                            var newQuest = document.createElement("p");
                            newQuest.innerHTML = question;

                            var newAnswer = document.createElement("span")
                            newAnswer.className = "card-footer text-muted card-img-top"
                            newAnswer.innerHTML = res_answer.text
                            var questImg = document.createElement("img");
                            questImg.className = "card-img-top";
                            questImg.alt = ""
                            questImg.src = result.result[i].question.image
                            var cardBody = document.createElement("div");
                            cardBody.className = "card-body"
                            cardBody.append(newQuest)

                            card.append(cardHeader, questImg, newQuest, cardBody, newAnswer)
                            divCol.append(card)
                            divRow.append(divCol)
                            divContainer.append(divRow)
                            divAnswer.append(divContainer)
                            document.body.appendChild(divAnswer);
                        }
                    }
                }
            }
        })
}