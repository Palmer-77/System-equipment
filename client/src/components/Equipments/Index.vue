<template>
  <div class="container">
    <main-header navsel="back"></main-header>
    <div class="book-header">
      <br />
      <br />
      <h2>ส่วนจัดการ อุปกรณ์</h2>
      <div>
        <form class="form-inline form-search">
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

      <div class="create-book">
        <button class="btn btn-success btn-sm" v-on:click="navigateTo('/equipment/create')">เพิ่มอุปกรณ์</button>
        <strong>จํานวน อุปกรณ์:</strong>
        {{results.length}}
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
        <!-- <p>id: {{ equipment.id }}</p> -->
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
            <strong>เพิ่มเมื่อ:</strong>
            {{ equipment.createdAt }}
          </p>
          <p>
            <strong>สถานะ:</strong>
            {{ equipment.status }}
          </p>
          <p>
            <strong>ราคาเมื่ออุปกรณ์เสียหาย:</strong>
            {{ equipment.prices | getNumberWithCommas }} บาท
          </p>
          <!-- <p>status: {{ equipment.status }}</p> -->
          <p>
            <button class="btn btn-sm btn-info" v-on:click="navigateTo('/equipment/'+ equipment.id)">ดูรายระเอียดอุปกรณ์</button>
            <button
              class="btn btn-sm btn-warning"
              v-on:click="navigateTo('/equipment/edit/'+ equipment.id)"
            >แก้ไขรายระเอียดอุปกรณ์</button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteEquipment(equipment)">ลบ</button>
          </p>
          <p>
            <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(equipment.id)">
              <i class="fas fa-pause"></i> Suspend
            </a>&nbsp;
            <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(equipment.id)">
              <i class="fas fa-check"></i> Published
            </a>&nbsp;
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>

    <div id="book-list-bottom">
      <div class="empty-book" v-if="equipments.length === 0 && loading === false">*** ไม่มีข้อมูล***</div>
      <div class="empty-book" v-if="equipments.length === 0 && loading === true">*** ไม่มีข้อมูล***</div>
      <div
        class="book-load-finished"
        v-if="equipments.length === results.length && results.length > 0"
      >โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
</template>
<script>
import EquipmentsService from "@/services/EquipmentsService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 5;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "equipments",
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
        this.results = (await EquipmentsService.index(value)).data;
        this.appendResults();

        this.results.forEach((equipment) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(book.category))
            if (this.category.indexOf(equipment.category) === -1) {
              this.category.push(equipment.category);
            }
          } else {
            this.category.push(equipment.category);
          }
        });
        this.loading = false;
        this.search = value;
        //console.log(this.category)
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
    };
  },
  async created() {
    this.equipments = (await EquipmentsService.index()).data;
  },
  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    appendResults: function () {
      if (this.equipments.length < this.results.length) {
        let toAppend = this.results.slice(
          this.equipments.length,
          LOAD_NUM + this.equipments.length // จำกัดการแสดงผล
        );
        this.equipments = this.equipments.concat(toAppend);
      }
    },
    navigateTo(route) {
      this.$router.push(route);
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
    async suspend(equipmentId) {
      let user = {
        id: equipmentId,
        status: " Suspend",
      };
      try {
        await EquipmentsService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async publish(equipmentId) {
      let user = {
        id: equipmentId,
        status: "published",
      };
      try {
        await EquipmentsService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
  },
  filters: {
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style scoped>
.empty-book {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}
.book-info {
  float: left;
}
.book-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.book-list {
  border-radius: 8px;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  background: skyblue;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.book-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

#book-list-bottom {
  padding-top: 4px;
}

#book-list-bottom {
  padding: 4px;
  text-align: center;
  color: white;
}
.categories {
  margin-top: 10px;
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
  background: paleturquoise;
  border-radius: 8px;
  color: black;
  text-decoration: none;
}
.create-book {
  margin-top: 10px;
}
.categories li.clear a {
  background: black;
  border-radius: 8px;
  color: white;
}
.book-load-finished {
  padding: 4px;
  text-align: center;
  background: darkslategrey;
  color: white;
}
.emptybook {
  background-color: coral;
  border-color: coral;
}
div {
    font-family: 'Kanit', sans-serif;
}
</style>