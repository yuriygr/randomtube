<template>
  <modal size="small" class="filters-modal">
    <modal-header :title="$t('modals.filters')">
      <template #after>
        <icon-button name="close-circle-line" mode="tertiary" @click.exact="closeModal" :title="$t('actions.close')" />
      </template>
    </modal-header>
    {{ data }}

    <div class="f-field">
      <div class="f-field__label">Длинна видео</div>
      <input type="text" class="f-field__input" />
    </div>

    <div class="f-field">
      <div class="f-field__label">Порядок воспроизведения</div>
      <input type="text" class="f-field__input" />
    </div>

    <div class="f-field">
      <div class="f-field__label">Скрывать с низким рейтингом</div>
      <input type="text" class="f-field__input" />
    </div>

    <footer class="modal__footer">
      <button @click.exact="closeModal">{{ $t('actions.cance') }}</button>
      <button>{{ $t('actions.save') }}</button>
    </footer>
  </modal>
</template>

<script>
export default {
  name: 'filters-modal',
  methods: {
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style>

</style>