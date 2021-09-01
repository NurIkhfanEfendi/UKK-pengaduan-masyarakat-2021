<template>
  <div class="container" style="margin-top:100px">
        <div class="card bg-light mx-auto" style="max-width: 550px">
            <article class="card-body mx-auto" >
                <div class="note">
                    <h4 class="card-title mt-3 text-center">Create Account</h4>
                </div>
                <br>
                <form v-on:submit.prevent="Register">
                  <div class="form-group input-group">
                        <input name="" class="form-control" placeholder="NIK" type="number" v-model="nik">
                    </div>
                    <div class="form-group input-group">
                        <input name="" class="form-control" placeholder="Nama" type="text" v-model="nama">
                    </div>
                    <select class="form-control mt-2 mb-2 pb-2 pt-2" v-model="jenis_kelamin">
                      <option value="L">laki laki</option>
                      <option value="P">perempuan</option>
                    </select>
                    <div class="form-group input-group">
                        <input name="" class="form-control" placeholder="Telp" type="number" v-model="telp">
                    </div>
                    <div class="form-group input-group">
                        <input name="" class="form-control" placeholder="User Name" type="text" v-model="username">
                    </div>
                    <div class="form-group input-group">
                        <input class="form-control" placeholder="Password" type="password" v-model="password">
                    </div>
                    <div class="form-group">
                        <button type="submit" href="#pablo" class="btn btn-primary btn-block"> Daftar </button>
                    </div>
                    <p class="text-center"><a href="/login">Login</a> </p>
                </form>
            </article>
        </div>
    </div>
</template> 
<script>
export default {
    data() {
      return {
        nik: '',
        nama: '',
        username: '',
        password: '',
        telp: '',
        jenis_kelamin: '',
        message: '',
        success: 'false',
        user:[],
      }
    },
    methods: {
      Register : function(){
        let form = new FormData();
        let username = this.username
        let password = this.password
        this.$bvToast.show("loadingToast");

        form.append("nik", this.nik);
        form.append("nama", this.nama);
        form.append("username", this.username);
        form.append("password", this.password);
        form.append("telp", this.telp);
        form.append("jenis_kelamin", this.jenis_kelamin);

        this.$store.dispatch("register", form)
        .then(response => {
          this.message = response.data.message;
          this.$bvToast.hide("loadingToast");
          this.$bvToast.show("message");
          // this.$store.dispatch('login', { username, password })
          this.$router.push('/login');
        });
        // .then(response => {
        //   this.success = response.data.success;
        //   if (this.success = "true"){
        //     this.$router.push('/login')
        //   } if (this.success = "false") {
        //     this.message = response.data.message;
        //     this.$bvToast.show("message");
        //     console.log(this.message);
        //   }
        // })
      },
    }
}
</script>