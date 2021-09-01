<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data kategori</b></p>
              <p class="card-description float-right">
                <b-button variant="success" v-b-modal.modalkategori v-on:click="tambahkategori"><i class="mdi mdi-plus btn-icon-prepend"></i>Tambah kategori</b-button>
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="kategori" :fields="fields">
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalkategori><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
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
      id="modalkategori"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Form kategori
      </template>
        <form ref="form">
          <div class="form-group">
            <label class="col-form-label">Nama Kategori : </label>
            <input type="text" class="form-control" placeholder="Nama Kategori" v-model="nama_kategori">
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
      id_kategori: "",
      nama_kategori: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      kategori: [],
      fields: ["id_kategori", "nama_kategori", "Aksi"],
    }
  },

  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/kategori", conf)
        .then((response) => {
          this.$bvToast.hide("loadingToast");
          this.kategori = response.data.data.kategori;
          console.log(this.kategori);
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

    tambahkategori : function(){
      this.action = "tambahkategori";
      this.nama_kategori = "";
    },

    Edit : function(item){
      this.action = "editkategori";
      this.id_kategori = item.id_kategori;
      this.nama_kategori = item.nama_kategori;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      let form = new FormData();
        form.append("id_kategori", this.id_kategori);
        form.append("nama_kategori", this.nama_kategori);

      if(this.action === "tambahkategori"){
        this.axios.post("/kategori", form, conf)
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
          nama_kategori: this.nama_kategori,
        }
        this.axios.put("/kategori/" + this.id_kategori, form, conf)
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
        this.axios.delete("/kategori/" + id, conf)
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