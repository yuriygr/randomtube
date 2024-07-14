<template>
  <modal size="small">
    <modal-header :title="$t('modals.report_entry')">
      <template #after>
        <icon-button name="close-circle-line" mode="tertiary" @click.exact="closeModal" :title="$t('actions.close')" />
      </template>
    </modal-header>

    <modal-checklist
      :title="$t('report.why')"
      :items="reasons"
      :current="current"
      
      @change="changeReason"
      @reset="resetReason"
    />

    <footer class="modal__footer">
      <n-button type="secondary" @click.exact="closeModal">{{ $t('actions.cancel') }}</n-button>
      <n-button :disabled="current == 0" @click.exact="sendReport">{{ $t('actions.send') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalChecklist, NButton, IconButton } from '@vue-norma/ui'

export default {
  name: 'report-item-modal',
  components: { Modal, ModalHeader, ModalChecklist, NButton, IconButton },
  props: [ 'data' ],
  data() {
    return {
      reasons: [
        { id: 1, label: this.$t('report.reason.gore') },
        { id: 2, label: this.$t('report.reason.harassment') },
        { id: 3, label: this.$t('report.reason.hateful') },
        { id: 4, label: this.$t('report.reason.self-harm') },
        { id: 5, label: this.$t('report.reason.nudity') },
        { id: 6, label: this.$t('report.reason.spam') },
        { id: 7, label: this.$t('report.reason.screamer') },
        { id: 8, label: this.$t('report.reason.terrorism') },
      ],
      current: 0
    }
  },
  methods: {
    changeReason(e, id) {
      this.current = id
    },
    resetReason(e) {
      this.current = 0
    },
    sendReport() {
      this.$store.dispatch('player/report', {
        id:     this.data.id,
        reason: this.current || 0
      })
      .then(_ => {
        this.$alerts.success({ text: 'Жалоба отправлена в спортлото' })
        this.$modals.close()
      })
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>