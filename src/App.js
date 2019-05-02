import React, { Component } from "react";
import bible from "./bible.json";
import "./App.css";

class App extends Component {
  state = {
    data: [],
    book: 0,
    chapter: 0,
    verseS: 0,
    verseE: 0,
    view: false,
    verseData: []
  };

  constructor() {
    super();
    this._result = this._result.bind(this);
  }

  componentDidMount() {
    document.title = "바이블 검색 페이지";
  }

  _selectBook = event => {
    this.setState({
      book: event.target.id
    });
  };

  _loadingOT = async () => {
    var temp = [];
    for (var i = 1; i <= 39; ++i) {
      temp.push(bible[0].version[i]);
    }

    this.setState({
      data: temp,
      book: 0,
      chapter: 0,
      verseS: 0,
      verseE: 0,
      view: false,
      verseData: []
    });
  };

  _loagingNT = async () => {
    var temp = [];
    for (var i = 40; i <= 66; ++i) {
      temp.push(bible[0].version[i]);
    }
    this.setState({
      data: temp,
      book: 0,
      chapter: 0,
      verseS: 0,
      verseE: 0,
      view: false,
      verseData: []
    });
  };

  _displayData = () => {
    const items = this.state.data.map(data => {
      return (
        <button
          className="book"
          id={data.book_nr}
          key={data.book_nr}
          onClick={this._selectBook}
        >
          {data.book_name}
        </button>
      );
    });
    return items;
  };

  _chapterVerse = () => {
    return (
      <form onSubmit={this._result}>
        <label>
          <input type="number" name="chapterNum" required="required" />장
        </label>
        <label>
          <input type="number" name="verseStart" required="required" />절 부터
        </label>
        <label>
          <input type="number" name="verseEnd" required="required" />절 까지
        </label>
        <input type="submit" value="보기" />
      </form>
    );
  };

  _result = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    var bnum = (this.state.book % 39) - 1;
    bnum = bnum < 0 ? bnum + 39 : bnum;
    var cnum = formData.get("chapterNum");
    var vsnum = formData.get("verseStart");
    var venum = formData.get("verseEnd");

    var maxChapter = Object.keys(this.state.data[bnum].book).length;
    if (cnum <= 0 || cnum > maxChapter) {
      alert("올바르지 않은 입력입니다.");
      return;
    }
    var maxVerse = Object.keys(this.state.data[bnum].book[cnum].chapter).length;
    if (vsnum <= 0 || vsnum > venum || venum > maxVerse) {
      alert("올바르지 않은 입력입니다.");
      return;
    }

    var temp = [];
    for (var i = vsnum; i <= venum; ++i) {
      temp.push(this.state.data[bnum].book[cnum].chapter[i]);
    }
    this.setState({
      chapter: cnum,
      verseS: vsnum,
      verseE: venum,
      verseData: temp,
      view: true
    });
  };

  _words = () => {
    const items = this.state.verseData.map(temp => {
      return (
        <div key={temp.verse_nr * 100}>
          {temp.verse_nr}. {temp.verse}
        </div>
      );
    });
    return items;
  };

  _copyData = () => {
    var copyText = document.querySelector(".verseDisplay");
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(copyText);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy");
    alert("클립보드에 복사 되었습니다!");
  };

  render() {
    return (
      <div className="App">
        <button id="ot" onClick={this._loadingOT}>
          구약
        </button>
        <button id="nt" onClick={this._loagingNT}>
          신약
        </button>
        <div className="books">
          {this.state.data.length !== 0 ? this._displayData() : null}
          {this.state.book !== 0 ? this._chapterVerse() : null}
        </div>
        {this.state.view ? (
          <button id="copy" onClick={this._copyData}>
            전체복사
          </button>
        ) : null}
        <div className="verseDisplay">
          <br />
          {this._words()}
        </div>
      </div>
    );
  }
}

export default App;
