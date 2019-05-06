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
    bookData: [],
    verseData: []
  };

  constructor() {
    super();
    this._result = this._result.bind(this);
  }

  componentDidMount() {
    document.title = "바이블 검색 페이지";
  }

  //구약 성경 불러와서 state data 갱신
  _loadingOT = async () => {
    let temp = [];
    for (let i = 1; i <= 39; ++i) {
      temp.push(bible[0].version[i]);
    }

    this.setState({
      data: temp,
      book: 0,
      chapter: 0,
      verseS: 0,
      verseE: 0,
      view: false,
      verseData: [],
      book_name: null
    });
  };

  //신약 성경 불러와서 state data 갱신
  _loagingNT = async () => {
    let temp = [];
    for (let i = 40; i <= 66; ++i) {
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

  //성경 선택하면 state에 성경 이름과 id를 갱신
  _selectBook = event => {
    let n = event.target.id;
    if (n > 39) {
      n = n - 40;
    } else {
      n = n - 1;
    }
    this.setState({
      book: event.target.id,
      bookName: this.state.data[n].book_name,
      bookData:this.state.data[n]
    });
  };

  //구약, 신약 선택 후 각 성경 리스트 버튼으로 리턴
  _displayData = () => {
    const items = this.state.data.map(data => {
      return (
        <button className="book" id={data.book_nr} key={data.book_nr} onClick={this._selectBook}>
          {data.book_name}
        </button>
      );
    });
    return items;
  };

  //성경을 선택하면 장, 절 입력 화면 출력
  _chapterVerse = () => {
    return <form onSubmit={this._result}>
        <label>
          <label id="bookinfo">{this.state.bookName}</label>
          <input type="number" pattern="\d*" name="chapterNum" required="required" content="user-scalable=no" />장
        </label>
        <label>
          <input type="number" pattern="\d*" name="verseStart" content="user-scalable=no" />절~
        </label>
        <label>
          <input type="number" pattern="\d*" name="verseEnd" content="user-scalable=no" />절
        </label>
        <input type="submit" value="보기" />
      </form>;
  };

  _result = (event) => {
    event.preventDefault();
    const ddata = this.state.bookData;

    //입력 form에서 입력 데이터 가져오기
    let formData = new FormData(event.target);

    //입력화면에 있는 장, 시작 절, 끝 절 값 가져오기
    let cnum = Number(formData.get("chapterNum"));
    let vsnum = (Number(formData.get("verseStart")) > 0 ? Number(formData.get("verseStart")):1);
    let venum = (Number(formData.get("verseEnd")) > 0 ? Number(formData.get("verseEnd")):999);

    //입력한 성경이 몇 장으로 이루어져있는지 정보 가져오기
    let maxChapter = Number(Object.keys(ddata.book).length);

    //입력이 올바르지 않을 시 alert출력 및 값 재설정
    if (cnum <= 0) {
      alert("올바르지 않은 입력입니다.");
      return;
    }
    //입력한 장이 해당 성경의 장수보다 높으면 마지막 장을 출력하도록 갱신
     if (cnum > maxChapter) {
       cnum = maxChapter;
     }

    //입력한 장이 몇 절로 이루어졌는지 정보 가져오기
    let maxVerse = Number(Object.keys(ddata.book[cnum].chapter).length);

    //입력이 올바르지 않을시 alert출력 및 값 재설정
    if (vsnum <= 0 || vsnum > venum ) {
      alert("올바르지 않은 입력입니다.");
      return;
    }

    let loaded = [];

    //입력한 절이 해당 장의 절수보다 높으면 마지막 절을 출력하도록 갱신
    if (venum > maxVerse) {
      venum = maxVerse;
    }
    if(vsnum > maxVerse){
      vsnum = maxVerse;
    }

    let i = vsnum;
    while (i <= venum) {
      loaded.push(ddata.book[cnum].chapter[i]);
      i++;
    }
    //bible.json파일에 있는 data에서 필요한 구절들을 배열에 넣고 state에 갱신
    this.setState({
      chapter: cnum,
      verseS: vsnum,
      verseE: venum,
      verseData: loaded,
      view: true
    });

  };

  //state에 있는 data div tag에 리턴
  _words = () => {
    const items = this.state.verseData.map(tempV => {
      return (
        <div key={tempV.verse_nr}>{tempV.verse_nr}. {tempV.verse}</div>
      );
    });
    return items;
  };

  //출력된 구절 클립보드에 복사하기
  _copyData = () => {
    let copyText = document.querySelector(".verseDisplay");
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(copyText);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy");
    alert("클립보드에 복사 되었습니다!");
  };

  render() {
    return <div className="AppDisplay" align="center" >
        <button id="ot" onClick={this._loadingOT}>
          구약
        </button>
        <button id="nt" onClick={this._loagingNT}>
          신약
        </button>
        <div className="books">
          {this.state.data.length !== 0 ? this._displayData() : null}
          {this.state.book !== 0 ? this._chapterVerse() : null}
          {this.state.book !== 0 ? <p id="lastinfo" align="left">
                해당 성경의 장 혹은 절 보다 큰 수 입력시 마지막 장 혹은 마지막 절 출력
              </p> : null}
        </div>
        {this.state.view ? <button id="copy" onClick={this._copyData}>
              전체복사
            </button> : null}
        <div className="verseDisplay" align="left">
          <br />
          {this._words()}
          {this.state.view && this.state.verseS !== this.state.verseE ? <p id="info">
                {this.state.bookName} {this.state.chapter}:{this.state.verseS}
                ~{this.state.verseE} KRV
              </p> : null}
          {this.state.view && this.state.verseS === this.state.verseE ? <p id="info">
                {this.state.bookName} {this.state.chapter}:{this.state.verseS} KRV
              </p> : null}
          <br />
          <br />
        </div>
        <p align="left" id="notice">
          성경본문은 getbible.net에서 개역한글판을 가져왔으며 오류 및 수정은 jungdw0624@gmail.com으로
          알려주시기 바랍니다.
        </p>
      </div>;
  }
}

export default App;
