import React, { Component } from "react";
import "./Hangman.css";
import { randomWord } from './words'
import img0 from "./0.jpg";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";

class Hangman extends Component {
  /** by default, allow 6 guesses and use provided gallows images. */
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };

  constructor(props) {
    super(props);
    this.state = { nWrong: 0, nCorrect:0, guessed: new Set(), answer: randomWord() };
    this.handleGuess = this.handleGuess.bind(this);
    this.reset = this.reset.bind(this)
    this.points = this.points.bind(this)
    this.gameState = this.gameState.bind(this)
  }

  /** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
  guessedWord() {
    return this.state.answer
      .split("")
      .map(ltr => (this.state.guessed.has(ltr) ? ltr : "_"));
  }

  /** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
  */
  handleGuess(evt) {
    let ltr = evt.target.value;
    this.setState(st => ({
      guessed: st.guessed.add(ltr),
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1),
      nCorrect: st.nCorrect + (st.answer.indexOf(ltr) !== -1 ? 1 : 0)
    }));
  }

  reset(){
    this.setState(st => ({
      nWrong: 0,nCorrect:0, guessed: new Set(), answer: randomWord()
    }))
  }

  points(){
    const {nCorrect, nWrong} = this.state
    return (4 * nCorrect - 2 * nWrong)
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map(ltr => (
      <button
        key={ltr}
        value={ltr}
        onClick={this.handleGuess}
        disabled={this.state.guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  }

  gameState(){
    const {images, maxWrong} = this.props
    const {nWrong, answer} = this.state
    const isWin = this.guessedWord().join('') === answer
    

    /**logic to show winning, lossing messages 
    show and hide buttons and restart buttons accordingly */
    
    let gameControl
    if(nWrong < maxWrong){
      gameControl = <div>
        <img src={images[nWrong]} alt={`${nWrong} wrong guesses`}/>
        <h3>{isWin ? `Yippee you win :)` : `Wrong Guesses : ${nWrong}` }</h3>
        <p className='Hangman-word'>{this.guessedWord()}</p>
        <p className='Hangman-btns'>{!isWin && this.generateButtons()}</p>
      </div>
    }else{
      gameControl = <div>
        <h3>You Lose :(</h3>
        <p className='Hangman-word'>{answer}</p>
      </div>
    }
    return gameControl
  }

  /** render: render game */
  render() {
    const { answer } = this.state
    const hints = 
      <span className='Hangman-hint'>
          {answer[0] + `${'_'.repeat(answer.length - 2)}`
          + answer[answer.length - 1]}
      </span>
    const restart = <button id='reset' onClick={this.reset}>Restart</button>
    
    return (
      <div className='Hangman'>
        <div className='Hangman-column'>
          <h1>Hangman</h1>
          {this.gameState()}
        </div>
        <div className='Hangman-column'>
          <div className='Hangman-game-resource'>
            <h2>Hints : {hints}</h2>
            <h2>Points : {this.points()}</h2>
            <p>{restart}</p>
          </div>
        </div>       
      </div>
    );
  }
}

export default Hangman;
