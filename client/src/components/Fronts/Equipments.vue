<template>
  <div>
    <main-header navsel="front"></main-header>
    <div class="hero-wrapper">
      <div class="component-wrapper">
        <div class="hero">
          <img src="@/assets/scientist.png" class="logo" style="float:left" />
          <h1>เลือกอุปกรณ์ที่จะใช้งานได้เลย</h1>
          <p>By Steve Black</p>
        </div>
        <div class="container new-book">
          <h2>อุปกรณ์ที่เพิ่มมาใหม่</h2>
          <div class="row">
            <div class="col-md-3" v-for="equipment in newEquipments" v-bind:key="equipment.id">
              <div v-if="equipment.thumbnail != 'null'">
                <img class="img-responsive" :src="BASE_URL+equipment.thumbnail" alt="thumbnail" />
              </div>
              <h4>{{ equipment.title }}</h4>
              <div v-html="equipment.content.slice(0,60) + '...'"></div>
              <p>
                <strong>ราคาค่าปรับเมื่ออุปกรณ์เสียหาย:</strong>
                {{ equipment.prices | getNumberWithCommas
                }}
              </p>
              
              <div>
                <button v-on:click.prevent="addCart(equipment)" class="btn btnsm btn-danger">
                  <i class="far fa-clipboard"></i> เลือก
                </button>
                <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front-view-equipment/'+ equipment.id)">
                  <i class="fab fareadme"></i> อ่านเพิ่ม
                </button>
                
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="book-header">
          <div>
            <form class="form-inline form-search">
              <span>
                <strong>จำนวน อุปกรณ์:</strong>
                {{results.length}}
              </span>
              &nbsp;
              <div class="form-group">
                <div class="input-group">
                  <input
                    type="text"
                    v-model="search"
                    class="form-control"
                    id="exampleInputAmount"
                    placeholder="Search"
                  />
                  <div class="input-group-addon">
                    <i class="fas fa-search"></i>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <ul class="categories">
            <li v-for="cate in category" v-bind:key="cate.index">
              <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
            </li>
            <li class="clear">
              <a v-on:click.prevent="setCategory(' ')" href="#">ล้าง</a>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
        <transition-group name="fade">
          <div v-for="equipment in equipments" v-bind:key="equipment.id" class="book-list">
             <div class="popup-cart" v-if="carts.length">
            <h3>อุปกรณ์ที่ใช้งาน</h3>
            <ul class="cart">
              <li v-for="cart in carts" v-bind:key="cart.id">
                <div>{{ cart.equipmenttitle }} จํานวน {{ cart.qty}} x {{ cart.prices }}</div>
                <div>
                  <button v-on:click.prevent="inc(cart)">+</button>
                  <button v-on:click.prevent="dec(cart)">-</button>
                </div>
              </li>
            </ul>
            <hr />
            <p>รวมราคาค่าปรับเมื่ออุปกรณ์เสียหาย: {{total | getNumberWithCommas}} บาท</p>
            <button class="btn btn-xs btn-danger" v-on:click.prevent="sendBuy">
              <i class="fas fa-check-square"></i> ยืนยันการเลือกใช้งาน
            </button>
          </div>
            <!-- <p>id: {{ book.id }}</p> -->
            <div class="book-pic">
              <!-- <transition name="fade"> -->
              <div class="thumbnail-pic" v-if="equipment.thumbnail != 'null'">
                <img :src="BASE_URL+equipment.thumbnail" alt="thumbnail" />
              </div>
              <!-- </transition> -->
            </div>
            <h3>{{ equipment.title }}</h3>
            <div v-html="equipment.content.slice(0,200) + '...'"></div>
            <div class="book-info">
              <p>
                <strong>ประเภท:</strong>
                {{ equipment.category }}
              </p>
              <p>
                <strong>นำเข้าเมื่อ:</strong>
                {{ equipment.createdAt }}
              </p>
              <!-- <p>status: {{ equipment.status }}</p> -->
              <p>
                <strong>ราคาค่าปรับเมื่ออุปกรณ์เสียหาย:</strong>
                {{ equipment.prices | getNumberWithCommas
                }}
                
              </p>
              <p>
                <button v-on:click.prevent="addCart(equipment)" class="btn btnsm btn-danger">
                  <i class="far fa-clipboard"></i> เลือก
                </button>
                <button
                  class="btn btn-sm btn-info"
                  v-on:click="navigateTo('/front-view-equipment/'+ equipment.id)">
                  <i class="fab fareadme"></i> อ่านเพิ่ม
                </button>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
          
        </transition-group>
        <div v-if="equipments.length === 0 && loading === false" class="empty-book">*** ไม่มีข้อมูล***</div>
        <div id="book-list-bottom">
          <div class="book-load-finished" v-if="equipments.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EquipmentsService from "@/services/EquipmentsService";
import BuysService from "@/services/BuysService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";
import { mapState } from "vuex";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "front-equipments",
      };
      if (this.search !== "") {
        route.query = {
          search: this.search,
        };
      }
      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),
    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.equipments = [];
        this.results = [];
        this.loading = true;
        this.results = (await EquipmentsService.frontIndex(value)).data;
        this.appendResults();
        this.results.forEach((equipment) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(book.category))
            if (this.category.indexOf(equipment.category) === -1) {
              this.category.push(book.category);
            }
          } else {
            this.category.push(equipment.category);
          }
        });
        this.loading = false;
        this.search = value;
        // console.log(this.category)
      },
    },
  },
  data() {
    return {
      equipments: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: "",
      results: [],
      category: [],
      loading: false,
      newEquipments: [],
      carts: [],
      total: 0
    };
  },
  // async created () {
  // this.equipments = (await BooksService.index()).data
  // },
  async created() {
    let allEquipments = (await EquipmentsService.frontIndex()).data;
    this.newEquipments = allEquipments.slice(0, 4);
  },
  methods: {
    sendBuy() {
      this.carts.forEach(async (cart) => {
        console.log("cart: " + JSON.stringify(cart));
        try {
          await BuysService.post(cart);
          this.$router.push({
            name: "cartlist",
          });
        } catch (err) {
          console.log(err);
        }
      });
    },
    inc(item) {
      item.qty++;
      this.total += parseInt(item.prices);
    },
    dec(item) {
      item.qty--;
      this.total -= parseInt(item.prices);
      if (item.qty <= 0) {
        let i = this.carts.indexOf(item);
        this.carts.splice(i, 1);
        // this.total = 0
      }
    },
    appendResults: function () {
      if (this.equipments.length < this.results.length) {
        let toAppend = this.results.slice(
          this.equipments.length,
          LOAD_NUM + this.equipments.length
        );
        this.equipments = this.equipments.concat(toAppend);
      }
    },
    navigateTo(route) {
      if (this.user == null) {
        alert("Please, Register or Login before.\n\nThank you.");
      } else {
        this.$router.push(route);
      }
    },
    async deleteEquipment(equipment) {
      try {
        await EquipmentsService.delete(equipment);
        this.refreshData();
      } catch (err) {
        console.log(err);
      }
    },
    async refreshData() {
      this.equipments = (await EquipmentsService.index()).data;
    },
    setCategory(keyword) {
      if (keyword === " ") {
        this.search = "";
        console.log("null");
      } else {
        this.search = keyword;
      }
    },
    addCart(equipment) {
      if (this.user == null) {
        alert("Please, Register or Login before.\n\nThank you.");
      } else {
        this.total += parseInt(equipment.prices);

        let found = false;
        this.carts.map((cart) => {
          if (cart.equipmentid == equipment.id) {
            cart.qty++;
            found = true;
          }
        })

        if (!found) {
          let cart = {
            bookid: equipment.id,
            userid: this.user.id,
            email: this.user.email ,
            qty: 1,
            clientStatus: "กำลังใช้งาน",
            shopStatus: "รอการตรวจสอบ",
            booktitle: equipment.title,
            username: this.user.name,
            userlastname: this.user.lastname,
            prices: equipment.prices,
          };
          this.carts.push(cart);
        }

        // console.log('carts length: ' + this.carts.length)
      }
    },
  },
  updated() {
    let sens = document.querySelector("#book-list-bottom");
    pageWatcher = ScrollMonitor.create(sens);
    pageWatcher.enterViewport(this.appendResults);
  },
  beforeUpdated() {
    if (pageWatcher) {
      pageWatcher.destroy();
      pageWatcher = null;
    }
  },
  /*mounted() {
    if (!this.isUserLoggedIn) {
      this.$router.push({
        name: "front-books",
      });
    }
  },*/
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
  filters: {
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style scoped>
.popup-cart {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px #ddd;
  background: #fff;
  width: 360px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
}
.component-wrapper {
  padding-left: 5px;
  padding-right: 5px;
}
.hero {
  margin-top: 80px;
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  background: rgb(11, 138, 212);
  height: 250px;
  color: white;
  padding: 20px;
}
.hero h1 {
  margin-top: 30px;
}
.logo {
  padding-right: 20px;
}
.hero {
  margin-top: 80px;
  border-radius: 5px;
  background-image: url('https://www.zw3dthailand.com/wp-content/uploads/2017/02/background-bg.jpg');
  height: 250px;
  color: white;
  padding: 20px;
}
.hero h1 {
  margin-top: 30px;
}
.logo {
  padding-right: 20px;
  max-width: 200px;
}
.empty-book {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: darksalmon;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  border-radius: 8px;
  padding: 5px 5px 5px 5px;
  margin: 10px 10px 0px 0px;
}
.book-info {
  float: left;
}
.book-pic {
  border-radius: 8px;
  float: left;
}
.clearfix {
  clear: both;
}
.book-list {
  border: solid 1px #dfdfdf;
  border-radius: 15px;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  background: skyblue;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.book-header {
  margin-top: 80px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
#book-list-bottom {
  padding-top: 4px;
}
.book-load-finished {
  padding: 4px;
  text-align: center;
  background: rgb(11, 138, 212);
  color: white;
}
.categories {
  margin-top: 20px;
  padding: 0;
  list-style: none;
  float: left;
}
.categories li {
  float: left;
  padding: 2px;
}
.categories li a {
  padding: 5px 10px 5px 10px;
  border-radius: 8px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}
.categories li.clear a {
  border-radius: 8px;
  background: black;
  color: white;
}
.create-book {
  margin-top: 10px;
}
@media (max-width: 768px) {
  .logo {
    width: 120px;
  }
}
.new-book h2 {
  font-family: kanit;
  padding-bottom: 20px;
  margin-top: 30px;
}
.empty-book {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
  margin-left: auto;
  margin-right: auto;
}
div {
    font-family: 'Kanit', sans-serif;
}
</style>
