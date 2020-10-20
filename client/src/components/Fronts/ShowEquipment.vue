<template>
  <div class="component-wrapper container">
    <main-header navsel="front"></main-header>
    <div v-if="equipment">
      <div class="hero">
        <img src="@/assets/scientist.png" height="100%" class="logo" style="float:left" />
        <h1>เลือกอุปกรณ์ที่จะใช้งานได้เลย</h1>
          <p>By Steve Black</p>
      </div>
      <div class="book-wrapper" v-if="equipment != null">
        <center><div v-if="equipment.thumbnail != 'null'">
                <img class="img-responsive" :src="BASE_URL+equipment.thumbnail" alt="thumbnail" />
              </div></center>
        <h1>{{ equipment.title }}</h1>
        <p>
          <strong>Category:</strong>:
          <a
            href="#"
            v-on:click.prevent="navigateTo(`/front?search=${equipment.category}`)"
          >{{equipment.category }}</a>
        </p>
        <div class="content" v-html="equipment.content"></div>
        <!-- <p>category: {{ book.category }}</p>
        <p>status: {{ book.status }}</p>-->
      </div>
      <div class="back-nav">
        <button class="btn btn-success" v-on:click="navigateTo('/front-equipments')">
          <i class="fas fa-arrow-left"></i> กลับ
        </button>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import EquipmentsService from "@/services/EquipmentsService";
import UsersService from "@/services/UsersService";
import CommentComp from "@/components/Fronts/Comment";

export default {
  data() {
    return {
      equipment: null,
      BASE_URL: "http://localhost:8081/assets/uploads/",
      resultUpdated: "",
      users: null,
    };
  },
  components: {
    CommentComp,
  },
  async created() {
    // get book
    // check permission first
    try {
      let equipmentId = this.$route.params.equipmentId;
      this.equipment = (await EquipmentsService.show(equipmentId)).data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
};
</script>
<style scoped>
.hero {
  margin-top: 80px;
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  background: lightslategray;
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
.book-wrapper {
  background: skyblue;
  border-radius: 8px;
  margin-top: 20px;
  padding: 40px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
.thumbnail-pic img {
  width: 200px;
  border-radius: 8px;
  padding: 5px 5px 5px 5px;
  margin: 10px 10px 0px 0px;
}
.back-nav {
  margin-top: 20px;
  text-align: center;
}
.book-wrapper h1 {
  text-align: center;
  font-family: "kanit";
  padding-bottom: 50px;
}
.book-wrapper p {
  font-family: "kanit";
  font-size: 1.4em;
  padding-bottom: 20px;
}
.book-wrapper .content {
  font-family: "kanit";
  font-size: 1.2em;
}
div {
    font-family: 'Kanit', sans-serif;
}
</style>