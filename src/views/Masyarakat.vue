<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data masyarakat</b></p>
              <!-- <p class="card-description float-right">
                <b-button variant="success" v-b-modal.modalmasyarakat v-on:click="tambahmasyarakat"><i class="mdi mdi-plus btn-icon-prepend"></i>Tambah masyarakat</b-button>
              </p> -->
              <div class="table-responsive">
                <b-table striped hover :items="user" :fields="fields">
                    <template v-slot:cell(level)="data">
                    <b-badge variant="warning">{{ data.item.level }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalmasyarakat><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal 
      id="modalmasyarakat"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Form masyarakat
      </template>
        <form ref="form">
          <div class="form-group">
            <label class="col-form-label">NIK : </label>
            <input type="text" class="form-control" placeholder="NIK" v-model="nik">
          </div>
          <div class="form-group">
            <label class="col-form-label">Nama : </label>
            <input type="text" class="form-control" placeholder="Nama" v-model="nama">
          </div>
          <div class="form-group">
            <label class="col-form-label">Telp : </label>
            <input type="text" class="form-control" placeholder="Telp" v-model="telp">
          </div>
          <select class="form-control mt-2 mb-2 pb-2 pt-2" v-model="jenis_kelamin">
                      <option value="L">laki laki</option>
                      <option value="P">perempuan</option>
                    </select>
          <div class="form-group">
            <label class="col-form-label">Username : </label>
            <input type="text" class="form-control" placeholder="Username" v-model="username">
          </div>
          <div class="form-group">
            <label class="col-form-label">Password : </label>
            <input type="password" class="form-control" placeholder="Password" v-model="password">
          </div>
        </form>
    </b-modal>

  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      search: "",
      id: "",
      nik: "",
      nama: "",
      telp: "",
      level:"",
      jenis_kelamin:"",
      username: "",
      password: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      fields: ["nik", "nama", "telp", "level", "username","jenis_kelamin", "Aksi"],
    }
  },

  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/masyarakat", conf)
        .then((response) => {
          this.$bvToast.hide("loadingToast");
          this.user = response.data.data.user;
          console.log(this.user);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    tambahmasyarakat : function(){
      this.action = "tambahmasyarakat";
      this.nik = "";
      this.nama = "";
      this.telp = ""; 
      this.username = "";
      this.password = "";
      this.jenis_kelamin = "";
    },

    Edit : function(item){
      this.action = "editmasyarakat";
      this.id = item.id;
      this.nik = item.nik;
      this.nama = item.nama;
      this.telp = item.telp; 
      this.username = item.username;
      this.jenis_kelamin = item.jenis_kelamin;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      let form = new FormData();
        form.append("id", this.id);
        form.append("nik", this.nik);
        form.append("nama", this.nama);
        form.append("telp", this.telp);
        form.append("username", this.username);
        form.append("password", this.password);
        form.append("jenis_kelamin", this.jenis_kelamin);

      if(this.action === "tambahmasyarakat"){
        this.axios.post("/masyarakat", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          this.message = response.data.message;
          this.$bvToast.show("message");
          this.getData();
        })
        .catch(error => {
          console.log(error);
        });
      } else {
          let form = {
          nik: this.nik,
          nama: this.nama,
          telp: this.telp,
          jenis_kelamin: this.jenis_kelamin
        }
        this.axios.put("/masyarakat/" + this.id, form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          this.message = response.data.message;
          this.$bvToast.show("message");
          this.getData();
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/masyarakat/" + id, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>