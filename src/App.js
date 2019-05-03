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

  _result = (event) => {
    event.preventDefault();
    const ddata = this.state.bookData;
    //입력 form에서 입력 데이터 가져오기
    let formData = new FormData(event.target);

    //입력화면에 있는 장, 시작 절, 끝 절 값 가져오기
    let cnum = Number(formData.get("chapterNum"));
    let vsnum = Number(formData.get("verseStart"));
    let venum = Number(formData.get("verseEnd"));

    //입력한 성경이 몇 장으로 이루어져있는지 정보 가져오기
    let maxChapter = Number(Object.keys(ddata.book).length);

    //입력이 올바르지 않을 시 alert출력 및 값 재설정
    if (cnum <= 0) {
      alert("올바르지 않은 입력입니다.1");
      this._resetData();
      return;
    }

    //입력한 장이 몇 절로 이루어졌는지 정보 가져오기
    let maxVerse = Number(Object.keys(ddata.book[cnum].chapter).length);

    //입력이 올바르지 않을시 alert출력 및 값 재설정
    if (vsnum <= 0 || vsnum > venum) {
      alert("올바르지 않은 입력입니다.2");
      this._resetData();
      return;
    }

    let loaded = [];

    //입력한 장(절)이 해당 성경(장)의 장(절)수보다 높을수 마지막 장(절)을 출력하도록 갱신
    if (cnum > maxChapter) {cnum = maxChapter;}
    if (venum > maxVerse) {venum = maxVerse;}

    while (vsnum <= venum) {
      loaded.push(ddata.book[cnum].chapter[vsnum]);
      vsnum++;
    }
    //bible.json파일에 있는 data에서 필요한 구절들을 배열에 넣고 state에 갱신
    this.setState({
      chapter: cnum,
      verseS: Number(formData.get("verseStart")),
      verseE: venum,
      verseData: loaded,
      view: true
    });

  };

  //앱 초기화
  _resetData = () => {
    this.setState({
      data: this.state.data,
      verseData:[],
      chapter:0,
      verseS:0,
      verseE:0,
      view:false
    });
  }

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
    return (
      <div className="AppDisplay">
        <button id="ot" onClick={this._loadingOT}>구약</button>
        <button id="nt" onClick={this._loagingNT}>신약</button>
        <div className="books">
          {this.state.data.length !== 0 ? this._displayData() : null}
          {this.state.book!==0? this._chapterVerse() : null}
        </div>
        {this.state.view ? (<button id="copy" onClick={this._copyData}>전체복사</button>) : null}
        <div className="verseDisplay">
          <br />
          {this._words()}
          {this.state.view ? 
          (<p id="info">{this.state.bookName} {this.state.chapter}:{this.state.verseS}~{this.state.verseE} KRV</p>) : null}
          <br /><br />
        </div>
        <p>
          성경본문은 getbible.net에서 개역한글판을 가져왔으며 오류 및 수정은
          jungdw0624@gmail.com으로 알려주시기 바랍니다.
        </p>
      </div>
    );
  }
}

export default App;
