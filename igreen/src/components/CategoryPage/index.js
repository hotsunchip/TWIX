import './style.css';
import React from 'react';
import Productlist from './productlist';
import { db } from './../../firebase';

var count = 0;
var cgg = '';
class CategoryPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.match.params.cg);
    cgg = props.match.params.cg;
    this.state = {
      name: [],
      price: [],
      imgg: [],
      a: [],
      ecoval: [],
      img_src: [],
      score: 0,
      wished: [],
      id: [],
      wishlist: [],
    };
    this.datarefresh = this.datarefresh.bind(this);
    this.onesight = this.onesight.bind(this);
    this.bukkuk = this.bukkuk.bind(this);
    this.bukkukthen = this.bukkukthen.bind(this);
    this.wishthen = this.wishthen.bind(this);
  }

  bukkuk() {
    db.collection('companion').doc('bukkuk').get().then(this.bukkukthen);
    //var user = db.collection('users').doc('1').get().then(this.wishthen);
  }
  wishthen(doc) {
    // eslint-disable-next-line no-lone-blocks
    {
      let docs = doc.data();
      this.setState(()=>({
        wishlist : docs['wished'],
      })) 
    }
  }
  bukkukthen(doc) {
    var states = ['adult_bad', 'adult_normal', 'adult_good', 'adult_dance'];
    let docs = doc.data();

    for (var i = 0; i < Object.keys(docs).length; i++) {
      let dic = this.state.img_src;
      dic[i] = docs[states[i]];
      this.setState((prv) => ({
        img_src: dic,
      }));
    }
    console.log('companion img source list', this.state.img_src);
  }
  onesight() {
    var elements = document.getElementsByClassName('productbox');
    //var checked = count++;
    for (var i = 0; i < elements.length; i++) {
      if (count % 2 === 1)
        elements[i].classList.add('eco' + this.state.ecoval[i]);
      else elements[i].classList.remove('eco' + this.state.ecoval[i]);
    }
  }
  datarefresh(cg) {
    count = 0;
    var product = db
      .collection('products')
      .get()
      .then((snapshot) => {
        this.setState((prevState) => ({
          name: [],
          price: [],
          imgg: [],
          a: [],
          ecoval: [],
          wished: [],
          id: [],
        }));
        //snapshot.forEach(datacheck);
        //alert(document.getElementById('pc'))
        snapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          var vegan = document.getElementById('vegan').checked;
          var ap = document.getElementById('ap').checked;
          var harm = document.getElementById('harm').checked;
          var ecoonly = document.getElementById('ecoonly').checked;
          var veganvalid = !vegan || doc.data().vegan === vegan;
          var apvalid = !ap || doc.data().ap === ap;
          var harmvalid = !harm || doc.data().harm === harm;
          var cgtest = false;
          if (
            cgg == 'living' &&
            (doc.data().category == 'tissue' ||
              doc.data().category == 'cushion')
          ) {
            cgtest = true;
          } else if (
            cgg == 'bath' &&
            (doc.data().category == 'toothpaste' ||
              doc.data().category == 'shampoo')
          ) {
            cgtest = true;
          } else if (
<<<<<<< HEAD
            cgg === 'beauty' &&
            (doc.data().category === 'facial' || doc.data().category == 'pack')
=======
            cgg == 'beauty' &&
            (doc.data().category == 'facial' ||
              doc.data().category == 'container')
>>>>>>> 9306fa51d13dcaa3a42694917155870c498e0f1e
          ) {
            cgtest = true;
          }
          // var wishbool = wished.includes('' + doc.id) ? true : false;

          var ecovalid = !ecoonly || doc.data().eco > 0;
          // console.log(doc.id, " => ", doc.data());

          if (veganvalid && apvalid && harmvalid && ecovalid && cgtest)
            this.setState((prevState) => ({
              name: [...prevState.name, doc.data().name],
              price: [...prevState.price, doc.data().price],
              imgg: [...prevState.imgg, doc.data().imgg],
              a: [...prevState.a, doc.data().a],
              ecoval: [...prevState.ecoval, doc.data().eco],
              id: [...prevState.id, doc.id],
            }));
        });
        console.log(this.state);
        var sum = 0;
        var i;
        for (i = 0; i < this.state.id.length; i++) {
          // console.log('wishlist', this.state.wishlist)
          if (this.state.wishlist.includes('' + this.state.id[i])) {
            sum += this.state.ecoval[i];
            this.setState((prevState) => ({
              wished: [...prevState.wished, true],
            }));
          } else
            this.setState((prevState) => ({
              wished: [...prevState.wished, false],
            }));
        }
        this.setState((prevState) => ({ score: Math.round(sum / i) }));
        console.log(this.state.score);
      });
  }
  componentWillMount() {
    this.bukkuk();
    this.datarefresh(this.props.cg);
    //alert(this);
    console.log(this.state.img_src);
  }
  render() {
    // this.bukkuk();
    var states = ['adult_bad', 'adult_normal', 'adult_good', 'adult_dance'];
    const {
      name,
      price,
      imgg,
      a,
      ecoval,
      //img_src,
      score,
      wished,
      //id,
      //wishlist,
    } = this.state;

    return (
      <header>
        <div id="ccontainer">
          <div class="kkk"> {cgg}</div>
          <div class="checkbox1 kk">
            <label>친환경만</label>
            <input
              type="checkbox"
              id="ecoonly"
              value="에코"
              onClick={this.datarefresh}
            ></input>
            <label>environment</label>
            <input
              type="checkbox"
              id="vegan"
              value="비건"
              onClick={this.datarefresh}
            />
            <label>animal</label>
            <input
              type="checkbox"
              id="ap"
              value="동물보호"
              onClick={this.datarefresh}
            ></input>
            <label>health</label>
            <input
              type="checkbox"
              id="harm"
              value="유해물질x"
              onClick={this.datarefresh}
            ></input>
          </div>

          <button id="onesight" onClick={this.onesight}>
            한눈에보기
          </button>
          <div class="pcandimg">
            <div id="pc">
              <Productlist
                name={name}
                price={price}
                imgg={imgg}
                a={a}
                ecoval={ecoval}
                wished={wished}
              ></Productlist>
            </div>
            <div>
              <div id="cprofile">
                <img
                  id="bukkuk"
                  className="companion_gif1"
                  src={this.state.img_src[score]}
                  alt="companion"
                  key={this.state.score}
                ></img>
                <p>name : bukkuk</p>
                <p>state : {states[score]}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default CategoryPage;
