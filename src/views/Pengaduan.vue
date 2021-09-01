<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="Detail Pengaduan"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="auto"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <div class="container mt-3">
          <div class="row mb-4 ml-4 mr-4">
            <div class="col-sm"><h2>Pengaduan Masyarakat</h2></div>
            <div class="col-sm"><h3 class="text-right"> # 12345</h3></div>
          </div>
          <hr>
          <div class="row mb-4 ml-4 mr-4">
            <div class="col-sm">
              <address>
                <strong>Pelapor :</strong><br>
                  NIK  : {{ruser.nik}}<br>
                  Nama : {{ruser.nama}}<br>
                  Telp : {{ruser.telp}}
              </address>
            </div>
            <div class="col-sm text-right">
              <address>
                <strong>Tanggal Pengaduan :</strong><br>
                  {{report.tgl_pengaduan}}<br><br>
              </address>
            </div>      
          </div>
          
          <div class="card" style="margin: 30px;">
            <div class="card-header"><strong>Detail Pengaduan</strong></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-borderless">
                  <tr>
                    <th>Kategori</th>
                    <td>:</td>
                    <td>{{rkategori.nama_kategori}}</td>
                  </tr>
                  <tr>
                    <th>Isi Laporan</th>
                    <td>:</td>
                    <td>{{report.isi_laporan}}</td>
                  </tr>
                  <tr>
                    <th>Foto Bukti</th>
                    <td>:</td>
                    <td><img
                      style="max-width: 200px"
                      :src="
                        'http://localhost/laravel_pengaduan/public/uploads/' +
                        report.foto
                      "
                    /></td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>:</td>
                    <td><b-badge
                      variant="info"
                      v-if="report.status === 'terkirim'"
                      >{{ report.status }}</b-badge
                    >
                    <b-badge
                      variant="warning"
                      v-if="report.status === 'proses'"
                      >{{ report.status }}</b-badge
                    >
                    <b-badge
                      variant="success"
                      v-if="report.status === 'selesai'"
                      >{{ report.status }}</b-badge
                    >
                    <b-badge
                      variant="danger"
                      v-if="report.status === 'tolak'"
                      >{{ report.status }}</b-badge
                    ></td>
                  </tr>
                  <tr>
                    <th>Tanggapan</th>
                    <td>:</td>
                    <td>{{ (rtanggapan !== null) ? rtanggapan.tanggapan :null }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </vue-html2pdf>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Pengaduan</b></p>
              <div class="table-responsive">
                <b-table striped hover :items="pengaduan" :fields="fields">
                  <template v-slot:cell(kategori)="data">
                    <b-badge variant="warning">{{
                      data.item.kategori.nama_kategori
                    }}</b-badge>
                  </template>
                  <template v-slot:cell(status)="data">
                    <b-badge
                      variant="info"
                      v-if="data.item.status === 'terkirim'"
                      >{{ data.item.status }}</b-badge
                    >
                    <b-badge
                      variant="warning"
                      v-if="data.item.status === 'proses'"
                      >{{ data.item.status }}</b-badge
                    >
                    <b-badge
                      variant="success"
                      v-if="data.item.status === 'selesai'"
                      >{{ data.item.status }}</b-badge
                    >
                    <b-badge
                      variant="danger"
                      v-if="data.item.status === 'tolak'"
                      >{{ data.item.status }}</b-badge
                    >
                  </template>
                  <template v-slot:cell(foto)="data">
                    <img
                      style="max-width: 100px"
                      :src="
                        'http://localhost/laravel_pengaduan/public/uploads/' +
                        data.item.foto
                      "
                    />
                  </template>
                  <template v-slot:cell(tanggapan)="data">
                    {{ (data.item.tanggapan !== null) ? data.item.tanggapan.tanggapan :null }}
                  </template>
                  <template v-slot:cell(aksi)="data">
                    <b-button
                      size="sm"
                      variant="warning"
                      v-on:click="editStatus(data.item)"
                      v-b-modal.modalStatus
                      >Ganti Status</b-button
                    >
                    <br />
                    <b-button
                      class="mt-2"
                      size="sm"
                      variant="info"
                      v-on:click="tambahTanggapan(data.item)"
                      v-b-modal.modalTanggapan
                      >Kirim Tanggapan</b-button
                    >
                    <br />
                    <b-button
                      class="mt-2"
                      size="sm"
                      variant="danger"
                      v-on:click="generateReport(data.item)"
                      >Generate Laporan</b-button
                    >
                  </template>
                </b-table>
                <br />
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination"
                >
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
    <b-modal id="modalStatus" title="Ubah Status" hide-footer>
      <b-container fluid>
        <form v-on:submit.prevent="Save">
          Status :
          <select class="form-control mt-2 mb-2 pb-2 pt-2" v-model="status">
            <option value="terkirim">Terkirim</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
            <option value="tolak">Tolak</option>
          </select>
          <b-button
            variant="primary"
            class="pull-right btn-sm mt-2"
            type="submit"
            >Simpan</b-button
          >
        </form>
      </b-container>
    </b-modal>

    <b-modal id="modalTanggapan" title="Tambah Tanggapan" hide-footer>
      <b-container fluid>
        <form v-on:submit.prevent="Save">
          Kirim Tanggapan
          <b-form-input
            v-model="tanggapan"
            class="mt-2 mb-2 text"
            required
          ></b-form-input>
          <b-button
            variant="primary"
            class="pull-right btn-sm mt-2"
            type="submit"
            >Simpan</b-button
          >
        </form>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  data: function () {
    return {
      search: "",
      id_pengaduan: "",
      id_user: "",
      id_kategori:"",
      tgl_pengaduan: "",
      status: "",
      tanggapan: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      report: "",
      rtanggapan:"",
      rkategori:"",
      ruser: "",
      pengaduan: [],
      kategori:[],
      fields: [
        "tgl_pengaduan",
        "kategori",
        "isi_laporan",
        "foto",
        "status",
        "tanggapan",
        "aksi",
      ],
    };
  },

  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/pengaduan", conf)
        .then((response) => {
          this.$bvToast.hide("loadingToast");
          this.pengaduan = response.data.data.pengaduan;
          this.kategori = response.data.data.kategori;
          this.tanggapan = response.data.data.pengaduan.tanggapan;
          console.log(this.pengaduan);
          // console.log(this.tanggapan);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    pagination: function () {
      if (this.search == "") {
        this.getData();
      } else {
        this.searching();
      }
    },

    tambahTanggapan: function (item) {
      this.action = "tanggapan";
      this.id_pengaduan = item.id_pengaduan;
    },

    editStatus: function (item) {
      this.action = "status";
      this.id_pengaduan = item.id_pengaduan;
      this.status = item.status;
    },

    Save: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      let form = new FormData();
      form.append("action", this.action);
      form.append("id_pengaduan", this.id_pengaduan);
      form.append("status", this.status);
      form.append("tanggapan", this.tanggapan);

      if (this.action === "tanggapan") {
        this.axios
          .post("/pengaduan/tanggapan", form, conf)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            this.$bvModal.hide("modalTanggapan");
            this.message = response.data.message;
            this.$bvToast.show("message");
            console.log(this.message);
            this.getData();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.axios
          .post("/pengaduan/status", form, conf)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            this.$bvModal.hide("modalStatus");
            this.message = response.data.message;
            this.$bvToast.show("message");
            console.log(this.message);
            this.getData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    generateReport(item) {
      this.id_pengaduan = item.id_pengaduan;
      console.log(this.id_pengaduan);
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.axios
        .get("/pengaduan/" + this.id_pengaduan, conf)
        .then((response) => {
          this.report = response.data.data.pengaduan[0];
          this.rtanggapan = response.data.data.pengaduan[0].tanggapan;
          this.rkategori = response.data.data.pengaduan[0].kategori;
          this.ruser = response.data.data.pengaduan[0].user;
          console.log(this.ruser);
          this.$refs.html2Pdf.generatePdf();
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
  components: {
    VueHtml2pdf,
  },
  mounted() {
    this.key = localStorage.getItem("Authorization");
    this.getData();
  },
};
</script>
