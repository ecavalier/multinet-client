<template>
  <v-container
    class="graph-container"
    fill-height
    fluid
    pa-0
  >
    <v-app-bar
      app
      clipped-right
    >
      <v-toolbar-title
        class="ws-detail-title"
      >
        <v-icon
          class="ml-4 mr-5"
          color="grey lighten-1"
        >
          library_books
        </v-icon>

        <span class="breadcrumbs">
          <router-link
            :to="{
              name: 'workspaceDetail',
              params: { workspace }
            }"
          >{{ workspace }}</router-link>
          <v-icon
            class="mx-4"
            color="grey lighten-2"
          >chevron_right</v-icon>
          <v-icon
            class="mr-3"
            color="grey lighten-1"
          >timeline</v-icon>
          {{ graph }}
        </span>
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content class="fill-height">
      <v-container
        align-stretch
        d-flex
        fill-height
        flex-column
        fluid
        pa-0
      >
        <div :class="graphVisClasses">
          <v-list>
            <v-list-item>
              <v-list-item-title>
                Nodes: {{ totalNodes }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                Edges: {{ totalEdges }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-navigation-drawer
            absolute
            right
            permanent
          >
            <v-list subheader>
              <v-subheader>
                More ways to visualize
              </v-subheader>
              <v-divider />
              <div class="grey lighten-4 pa-3">
                <v-select
                  v-model="selectedVis"
                  :items="visItems"
                  background-color="white"
                  dense
                  hide-details
                  label="Visualization"
                  menu-props="auto"
                  outlined
                />
              </div>
              <v-divider />
              <v-list-item
                v-for="app in apps"
                :key="app.name"
                class="pl-2"
                :href="`${app.url}/?workspace=${workspace}&graph=${graph}`"
                target="_blank"
              >
                <v-list-item-avatar class="mr-3">
                  <v-icon color="blue lighten-3">
                    exit_to_app
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-title>
                  {{ app.name }}
                </v-list-item-title>
                <v-list-item-icon>
                  <v-icon color="blue lighten-3">
                    chevron_right
                  </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </div>
        <div :class="nodeColsClasses">
          <div class="node-types flex-grow-1">
            <v-card
              flat
              height="100%"
              tile
            >
              <v-toolbar
                color="blue darken-1"
                dark
                dense
                flat
              >
                <v-toolbar-title>
                  Node Types
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-0">
                <v-list
                  class="node-type-list pa-0"
                  color="transparent"
                  dense
                >
                  <v-list-item
                    v-for="table in nodeTypes"
                    :key="table.name"
                    class="pl-2"
                    :to="`/workspaces/${workspace}/table/${table}`"
                  >
                    <v-list-item-avatar class="my-0">
                      <v-icon
                        color="grey lighten-1"
                        size="18"
                      >
                        scatter_plot
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>
                      {{ table }}
                    </v-list-item-title>
                    <v-list-item-icon>
                      <v-icon color="grey lighten-1">
                        chevron_right
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <div class="edge-types flex-grow-1">
            <v-card
              color="grey lighten-5"
              flat
              height="100%"
              tile
            >
              <v-toolbar
                color="blue darken-2"
                dark
                dense
                flat
              >
                <v-toolbar-title>
                  Edge Types
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-0">
                <v-list
                  class="edge-type-list pa-0"
                  color="transparent"
                  dense
                >
                  <v-list-item
                    v-for="table in edgeTypes"
                    :key="table.name"
                    class="pl-2"
                    :to="`/workspaces/${workspace}/table/${table}`"
                  >
                    <v-list-item-avatar class="my-0">
                      <v-icon
                        color="grey lighten-1"
                        size="18"
                      >
                        device_hub
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>
                      {{ table }}
                    </v-list-item-title>
                    <v-list-item-icon>
                      <v-icon color="grey lighten-1">
                        chevron_right
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <div class="nodes-list flex-grow-1">
            <v-card
              flat
              height="100%"
              tile
            >
              <v-toolbar
                color="blue darken-1"
                dark
                dense
                flat
              >
                <v-toolbar-title>
                  Nodes
                </v-toolbar-title>
                <v-spacer />
                <div class="pagination">
                  <v-btn
                    class="mx-1"
                    icon
                    small
                    :disabled="!prev"
                    @click="firstPage()"
                  >
                    <v-icon>skip_previous</v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-1"
                    icon
                    small
                    :disabled="!prev"
                    @click="turnPage(false)"
                  >
                    <v-icon>chevron_left</v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-1"
                    icon
                    small
                    :disabled="!next"
                    @click="turnPage(true)"
                  >
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-1"
                    icon
                    small
                    :disabled="!next"
                    @click="lastPage()"
                  >
                    <v-icon>skip_next</v-icon>
                  </v-btn>
                </div>
              </v-toolbar>
              <v-card-text class="pa-0">
                <v-list
                  class="node-list pa-0"
                  color="transparent"
                  dense
                >
                  <v-list-item
                    v-for="node in nodes"
                    :key="node"
                    :to="`/workspaces/${workspace}/graph/${graph}/node/${node}`"
                  >
                    <v-list-item-title>
                      {{ node }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <v-btn
            class="tray-action"
            color="blue darken-2"
            dark
            depressed
            fab
            small
            @click="toggle"
          >
            <v-icon
              dark
              size="18"
            >
              {{ drawerIcon }}
            </v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-content>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import api from '@/api';
import { App } from '@/types';

export default Vue.extend({
  name: 'GraphDetail',
  filters: {
    appendArgs(url: string) {
      return `${url}/?workspace=${this.workspace}&graph=${this.graph}`;
    },
  },
  props: {
    workspace: {
      type: String as PropType<string>,
      required: true,
    },
    graph: {
      type: String as PropType<string>,
      required: true,
    },
    apps: {
      type: Array as PropType<App[]>,
      required: true,
    },
  },
  data() {
    const visItems = ['Network Overview'];
    return {
      nodeTypes: [] as string[],
      edgeTypes: [] as string[],
      nodes: [] as string[],
      offset: 0,
      limit: 10,
      totalNodes: 0,
      totalEdges: 0,
      visItems: [...visItems],
      selectedVis: visItems[0],
      panelOpen: true,
    };
  },
  computed: {
    highestOffset(): number {
      return (
        this.totalNodes % this.limit
          ? Math.floor(this.totalNodes / this.limit)
          : this.totalNodes / this.limit - 1
      ) * this.limit;
    },
    next(): boolean {
      return this.highestOffset !== this.offset;
    },
    prev(): boolean {
      return this.offset !== 0;
    },
    nodeColsClasses(): string {
      const {
        panelOpen,
      } = this;

      return `d-flex flex-row node-cols${panelOpen ? '' : ' node-cols-closed'}`;
    },
    graphVisClasses(): string {
      const {
        panelOpen,
      } = this;

      return `graph-vis${panelOpen ? '' : ' graph-vis-closed'}`;
    },
    drawerIcon(): string {
      return this.panelOpen ? 'expand_more' : 'expand_less';
    },
  },
  watch: {
    offset() {
      this.update();
    },
    limit() {
      this.update();
    },
    workspace() {
      this.update();
    },
    graph() {
      this.update();
    },
  },
  created() {
    this.update();
  },
  methods: {
    toggle() {
      this.panelOpen = !this.panelOpen;
    },
    async update() {
      const graph = await api.graph(this.workspace, this.graph);
      const nodes = await api.nodes(this.workspace, this.graph, {
        offset: this.offset,
        limit: this.limit,
      });

      const edgeQuery = `
        FOR table in [${graph.edgeTable}]
          RETURN LENGTH(table)
      `;
      const edges = await api.aql(this.workspace, edgeQuery);

      this.nodeTypes = graph.nodeTables;
      this.edgeTypes = [graph.edgeTable];
      // eslint-disable-next-line no-underscore-dangle
      this.nodes = nodes.nodes.map((d) => d._id);
      this.totalNodes = nodes.count;
      this.totalEdges = edges.reduce((acc, val) => acc + val, 0);
    },
    turnPage(forward: number) {
      this.offset += forward ? this.limit : -this.limit;
    },
    lastPage() {
      this.offset = this.highestOffset;
    },
    firstPage() {
      this.offset = 0;
    },
  },
});
</script>

<style scoped>
ul {
  padding: 10px;
  list-style-type: none;
  text-align: left;
}

.graph-vis {
  height: calc(100vh - 314px);
  position: relative;
  z-index: 1;
}

.graph-vis-closed {
  height: calc(100vh - 75px);
}

.node-cols {
  height: 250px;
  position: relative;
  z-index: 2;
}

.node-cols > div {
  height: 100%;
}

.node-cols-closed {
  height: 11px;
}

.node-cols-closed > * {
  overflow: hidden;
}

.node-type-list,
.edge-type-list,
.node-list {
  overflow-y: auto;
  max-height: 202px;
}

.tray-action {
  height: 22px;
  position: absolute;
  right: calc(50% + 13px);
  top: -11px;
  width: 22px;
}

.tray-action i {
  margin-top: -1px;
}

.ws-detail-title {
  align-items: center;
  display: flex;
  letter-spacing: 0;
  width: 95%;
}
.ws-detail-title a {
  text-decoration: none;
}
.ws-detail-title a:hover {
  text-decoration: underline;
}
</style>
