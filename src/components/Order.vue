<template>
  <v-card
    class="mx-auto"
    max-width="600"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">{{status}}</div>
        <v-list-item-title class="headline mb-1">{{name}}</v-list-item-title>
        <v-list-item-subtitle>{{phone}} - {{email}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-timeline
      align-top
      dense
    >
      <v-timeline-item
        color="white"
        small
      >
        <div>
          <div class="font-weight-normal">
            <strong>Asperges blanches</strong> - {{ aspb }} botte(s)
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item
        color="green"
        small
      >
        <div>
          <div class="font-weight-normal">
            <strong>Asperges vertes</strong> - {{ aspv }} botte(s)
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item
        color="red"
        small
      >
        <div>
          <div class="font-weight-normal">
            <strong>Fraises</strong> - {{ fraise }} barquette(s)
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
    <br/>

    <v-card-text>
      <v-chip class="mr-2">
        <v-icon left>
          mdi-calendar-clock
        </v-icon>
        {{day}}
      </v-chip>
      <v-chip class="mr-2">
        <v-icon left>
          mdi-clock
        </v-icon>
        {{hour}}
      </v-chip>
      <v-chip class="mr-2">
        <v-icon left>
          mdi-map-marker
        </v-icon>
        {{place}}
      </v-chip>
    </v-card-text>

    <v-card-actions>
      <v-btn color="green" outlined>Accepter</v-btn>
      <v-btn color="red" outlined>Refuser</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="comments && comments.length>0"
        @click="show = !show"
      >
        Commentaire
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
    <div v-show="show"
      v-if="comments && comments.length>0"
      >
      <v-divider></v-divider>
      <v-card-text>{{comments}}</v-card-text>
    </div>
  </v-expand-transition>
  </v-card>
</template>

<script>

  export default {
    name: 'Order',
    props: {
      id: String,
      name: String,
      phone: String,
      email: String,
      aspb: Number,
      aspv: Number,
      fraise: Number,
      day: String,
      hour: String,
      place: String,
      status: String,
      comments: String,
    },
    data: () => ({
      show: true,
      response: null,
    }),
    methods: {},

    mounted () {},

  }
</script>
