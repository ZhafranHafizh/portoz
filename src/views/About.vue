<template>
  <div class="about-view">
    <h1>Tentang Saya</h1>
    <div class="content">
      <img src="@/assets/Face.jpg" alt="Foto Saya" class="about-pic">
      <div class="text">
        <p>
          As a Software Engineering student at Telkom University, I possess a deep interest in technology and am dedicated to keeping up with the latest innovations. Although new to the professional workforce, I've honed valuable team collaboration and leadership abilities through project-based assignments. I'm a motivated learner, keen to expand my skills through coursework and personal initiatives, and always ready to contribute effectively to a team.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView '
}
</script>

<style scoped>
.about-view {
  max-width: 900px;
  margin: 40px auto;
  padding: 2rem;
  text-align: center;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  margin-top: 30px;
}
.about-pic {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
}
.text {
  max-width: 600px;
}
.text p {
  line-height: 1.6;
  margin-bottom: 15px;
}

@media (min-width: 768px) {
  .content {
    flex-direction: row;
    text-align: left;
  }
  .about-pic {
    margin-right: 40px;
    margin-bottom: 0;
  }
}
</style>