<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Petugas</b></p>
              <p class="card-description float-right">
                <b-button variant="success" v-b-modal.modalPetugas v-on:click="tambahPetugas"><i class="mdi mdi-plus btn-icon-prepend"></i>Tambah Petugas</b-button>
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="user" :fields="fields">
                    <template v-slot:cell(level)="data">
                    <b-badge variant="warning">{{ data.item.level }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalPetugas><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
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
      id="modalPetugas"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Form Petugas
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
      username: "",
      password: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      fields: ["nik", "nama", "telp", "level", "username", "Aksi"],
    }
  },

  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/petugas", conf)
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

    tambahPetugas : function(){
      this.action = "tambahPetugas";
      this.nik = "";
      this.nama = "";
      this.telp = ""; 
      this.username = "";
      this.password = "";
    },

    Edit : function(item){
      this.action = "editPetugas";
      this.id = item.id;
      this.nik = item.nik;
      this.nama = item.nama;
      this.telp = item.telp; 
      this.username = item.username;
      this.password = item.password;
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

      if(this.action === "tambahPetugas"){
        this.axios.post("/petugas", form, conf)
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
          username: this.username,
          password: this.password
        }
        this.axios.put("/petugas/" + this.id, form, conf)
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
        this.axios.delete("/petugas/" + id, conf)
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