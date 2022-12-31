"use strict";
class Rating extends CommentSystem {
    addListenerCommentsRatingBtns(commentID) {
        const commentBlockEl = document.querySelector(`[data-commentid="${commentID}"]`);
        if (commentBlockEl) {
            const ratingBtnBlock = commentBlockEl.querySelector('.comments__rating');
            if (ratingBtnBlock)
                this.listenerBtnBlock(ratingBtnBlock, commentID);
        }
    }
    addListenerReplyRatingBtns(commentID, replyID) {
        const commentBlockEl = document.querySelector(`[data-commentid="${commentID}"]`);
        if (commentBlockEl) {
            const replyEl = commentBlockEl.querySelector(`[data-replyid="${replyID}"]`);
            if (replyEl) {
                const ratingBtnBlock = replyEl.querySelector('.comments__rating');
                if (ratingBtnBlock)
                    this.listenerBtnBlock(ratingBtnBlock, commentID, replyID);
            }
        }
    }
    listenerBtnBlock(ratingBlock, commentID, replyID) {
        const currentData = super.getDATA();
        if (ratingBlock) {
            const plusBtn = ratingBlock.querySelector('.plus');
            const minusBtn = ratingBlock.querySelector('.minus');
            const counter = ratingBlock.querySelector('.likeCounter');
            if (counter) {
                let curCounter = 0;
                if (replyID === undefined) {
                    currentData.history.forEach((commentBlock) => {
                        if (+commentBlock.commentID === commentID) {
                            curCounter = commentBlock.rating === undefined ? 0 : +commentBlock.rating;
                        }
                        counter.innerHTML = String(curCounter);
                        this.changeStyleCounter(counter, curCounter);
                    });
                }
                else {
                    currentData.history.forEach((commentBlock) => {
                        if (+commentBlock.commentID === commentID) {
                            curCounter = commentBlock.replyes[`reply_${replyID}`].rating === undefined
                                ? 0
                                : +commentBlock.replyes[`reply_${replyID}`].rating;
                        }
                        counter.innerHTML = String(curCounter);
                        this.changeStyleCounter(counter, curCounter);
                    });
                }
                let newCounter = curCounter;
                const plusListener = () => {
                    if (plusBtn && minusBtn) {
                        if (!(plusBtn.classList.contains('plus_disable'))) {
                            newCounter++;
                            if (newCounter !== curCounter) {
                                plusBtn.classList.add('plus_disable');
                            }
                            minusBtn.classList.remove('minus_disable');
                            counter.innerHTML = String(newCounter);
                            this.updateCounterHistory(newCounter, commentID, replyID);
                            this.changeStyleCounter(counter, newCounter);
                        }
                    }
                };
                const minusListener = () => {
                    if (plusBtn && minusBtn) {
                        if (!(minusBtn.classList.contains('minus_disable'))) {
                            newCounter--;
                            if (newCounter !== curCounter) {
                                minusBtn.classList.add('minus_disable');
                            }
                            plusBtn.classList.remove('plus_disable');
                            counter.innerHTML = String(newCounter);
                            this.updateCounterHistory(newCounter, commentID, replyID);
                            this.changeStyleCounter(counter, newCounter);
                        }
                    }
                };
                if (plusBtn)
                    plusBtn.addEventListener('click', plusListener);
                if (minusBtn)
                    minusBtn.addEventListener('click', minusListener);
            }
        }
    }
    updateCounterHistory(curCounter, commentID, replyID) {
        const currentData = super.getDATA();
        if (replyID === undefined) {
            let newCommentBlock;
            currentData.history.forEach((commentBlock) => {
                if (+commentBlock.commentID === commentID) {
                    commentBlock.rating = curCounter;
                    newCommentBlock = commentBlock;
                }
            });
            currentData.history.forEach((commentBlock, index) => {
                if (+commentBlock.commentID === commentID) {
                    currentData.history[index] = newCommentBlock;
                }
            });
            localStorage.setItem('DATA', JSON.stringify(currentData));
        }
        else {
            currentData.history.forEach((commentBlock) => {
                if (+commentBlock.commentID === commentID) {
                    commentBlock.replyes[`reply_${replyID}`].rating = curCounter;
                    super.updateHistoryReply(commentID, replyID, commentBlock.replyes[`reply_${replyID}`]);
                }
            });
        }
    }
    changeStyleCounter(counterElement, counterNumber) {
        if (counterNumber > 0) {
            counterElement.style.color = '#8AC540';
        }
        else if (counterNumber < 0) {
            counterElement.style.color = '#FF0000';
            counterElement.innerHTML = String(+counterElement.innerHTML * -1);
        }
        else {
            counterElement.style.color = '#000000';
        }
    }
}
