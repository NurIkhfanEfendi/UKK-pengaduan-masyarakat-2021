<template>
  <div>
    <div class="container" style="margin-top: 100px; margin-bottom: 150px">
      <div class="card bg-light mx-auto" style="max-width: 450px">
        <article class="card-body mx-auto" style="max-width: 420px">
          <div class="note">
            <h4 class="card-title mt-3 text-center">Selamat Datang</h4>
            <p>Silahkan login untuk mengakses website pengaduan masyarakat.</p>
          </div>
          <br />
          <form v-on:submit.prevent="Login">
            <div class="form-group input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-user"></i>
                </span>
              </div>
              <input
                name=""
                class="form-control"
                placeholder="User Name"
                type="text"
                v-model="username"
              />
            </div>
            <div class="form-group input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-lock"></i>
                </span>
              </div>
              <input
                class="form-control"
                placeholder="Password"
                type="password"
                v-model="password"
              />
            </div>
            <div class="form-group">
              <button
                type="submit"
                href="#pablo"
                class="btn btn-primary btn-block"
              >
                Masuk
              </button>
            </div>
            <p class="text-center">
              Don't have an account? <a href="/register">Create Account</a>
            </p>
          </form>
        </article>
      </div>
    </div>
    <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
      <b-spinner label="Spinning" variant="success"></b-spinner>
      <strong class="text-success">Loading...</strong>
    </b-toast>

    <!-- toast untuk tampilan message box -->
    <b-toast id="message" title="Message">
      <strong class="text-success">{{ message }}</strong>
    </b-toast>
  </div>
</template> 
<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
      level: "",
      user: []
    };
  },
  methods: {
    Login: function () {
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(response => {
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
            this.user = response.data.data.user;
            if (this.user.level === "masyarakat") {
                this.$bvToast.hide("loadingToast");
                this.$router.push('/form');
            }else{
                this.$bvToast.hide("loadingToast");
                this.$router.push('/pengaduan');
            }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

