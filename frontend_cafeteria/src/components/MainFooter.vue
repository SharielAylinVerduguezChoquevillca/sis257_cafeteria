<template>
  <footer class="py-5">
    <div class="w-full px-6 mx-auto">
      <div class="footer-divider"></div>
      <div class="flex flex-wrap items-center justify-between">
        <div class="w-full text-center">
          <p class="footer-text">
            © 2026 Cafeteria El Buen Gusto
            <span class="footer-sep">|</span>
            Desarrollado por
            <span class="footer-names">Shariel Verduguez &amp; Vanessa Villarroel</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-divider {
  height: 1px;
  margin: 0 auto 1rem;
  max-width: 1000px;
  background: linear-gradient(to right, transparent, #d8c6ad, transparent);
}

.footer-text {
  margin: 0;
  font-size: 13px;
  color: #a98a66;
}

.footer-sep {
  margin: 0 6px;
  color: #c9b599;
}

.footer-names {
  color: #6f4e37;
  font-weight: 600;
}
</style>