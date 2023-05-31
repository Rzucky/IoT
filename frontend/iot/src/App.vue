<template>
  <div v-if="!user" class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-4">
        <h3 class="text-center">Login</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" v-model="username" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required>
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
    <div v-else class="container border border-3 rounded-3 p-5 bg-light">

    <h2 class="text-center mb-5">Welcome home, {{ user.name }}</h2>
    <div v-for="(device, index) in user.devices" :key="index" class="row justify-content-center">
      <div class="col-4">
        <button @click="publish(device.name, device.active)"  class="btn btn-primary btn-lg btn-block mb-3">
          <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-laptop" viewBox="0 0 16 16">
              <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
            </svg>
            <span class="mx-3" >{{ device.name }}</span>
        </button>
      </div>
    </div>
  </div>

</template>

<script>

import axios from 'axios'

export default {
  name: 'App',
  data() {
      return {
          user: null,
          username: '',
          password: '',
          name: ''
      };
    },

  methods: {
    async publish(device_name, status)
    {
      for(const dev of this.user.devices)
      {
        if (dev.name === device_name)
        {
          dev.active = !dev.active
          status = dev.active
        }
      } 
      console.log('asdasd',{
          user: this.user,
          name: device_name,
          status
        })
      const resp = await axios.post('https://iot-fer-backend.onrender.com/publish', 
        {
          user: this.user,
          name: device_name,
          status
        }
      )
      if (resp.status === 500)
      {
        console.log(resp)
      }
    },

    async submitForm()
    {
      const resp = await axios.post('https://iot-fer-backend.onrender.com/login', 
        {
          username: this.username, 
          password: this.password
        }
      )
      this.user = resp.data
      for(const dev of this.user.devices)
      {
        dev.active = false
      }
    }
  }
}
</script>
