<template>
  <div class="container mt-3">
    <div class="card mb-4">
      <div class="card-header"><strong>Form Pengaduan</strong></div>
      <div class="card-body">
        <form ref="form" v-on:submit.prevent="Save">
          <!-- <div class="form-group">
            <label class="col-form-label">Tanggal Pengaduan</label>
            <input type="date" class="form-control" v-model="tgl_pengaduan" />
          </div> -->
          Kategori :
          <select
            class="form-control mt-2 mb-2 pb-2 pt-2"
            v-model="id_kategori"
          >
            <option
              v-for="item in kategori"
              :value="item.id_kategori"
              :key="item.id_kategori"
            >
              {{ item.nama_kategori }}
            </option>
          </select>
          <div class="form-group">
            <label class="col-form-label">Isi Laporan</label>
            <input type="text" class="form-control" v-model="isi_laporan" />
          </div>
          <div class="form-group">
            <label class="col-form-label">Foto Bukti</label>
            <br />
            <input type="file" id="foto" :required="req_file"/>
          </div>
          <b-button variant="primary" class="pull-right btn mt-2" type="submit"
            >Kirim Pengaduan</b-button
          >
        </form>
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
</template>

<script>
module.exports = {
  data: function () {
    return {
      id_pengaduan: "",
      // tgl_pengaduan: "",
      isi_laporan: "",
      foto:"",
      id_kategori:"",
      nama_kategori:"",
      status: "",
      action: "",
      message: "",
      rows: "",
      currentPage: "",
      perPage: 10,
      key: "",
      kategori: [],
      file:"",
      req_file: true,
      
    };
  },

  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/kategorimasyarakat", conf)
        .then((response) => {
          this.$bvToast.hide("loadingToast");
          this.kategori = response.data.data.kategori;
          console.log(this.kategori);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    inputPengaduan : function(){
      this.action         = "insert";
      // this.tgl_pengaduan  = "";
      this.isi_laporan    = "";
      this.id_kategori    = "";  
      this.foto           = ""; 
      document.getElementById("foto").value = null;
    },
    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      
        let form = new FormData();
        form.append("id_pengaduan", this.id_pengadu);
        // form.append("tgl_pengaduan", this.tgl_pengaduan);
        form.append("isi_laporan", this.isi_laporan);
        form.append("id_kategori", this.  id_kategori);
        form.append("foto", document.getElementById("foto").files[0]);
        
        this.axios.post("/masyarakat/pengaduan", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          this.message = response.data.message;
          this.$bvToast.show("message");
          this.$router.push('/masyarakatpengaduan');
        })
        .catch(error => {
          console.log(error);
        });
      
    },
  },
  mounted() {
    this.key = localStorage.getItem("Authorization");
    this.getData();
  },
};
</script>