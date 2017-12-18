<template>
    <div style="display:inline-block;padding:0 6px;">
        <Tooltip content="更改语言" placement="left">
            <Dropdown trigger="click" @on-click="setLang">
                <a href="javascript:void(0)">
                    <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#495060" :size="18" type="ios-world"></Icon>
                    <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem v-for="(item, index) in langList" :key="index" :name="item.name">
                        <Row type="flex" justify="center" align="middle" :gutter="16">

                            <Col md="2">
                                <span v-if="lang===item.name"><Icon :size="14" type="checkmark"/></span>
                                <!--<span><Icon :size="14" type="checkmark"/></span>-->
                            </Col>

                            <Col md="2">
                            <span>{{item.title}}</span>
                            </Col>
                        </Row>

                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </Tooltip>
    </div>
</template>

<script>
  export default {
    name: 'langSwitch',
    data () {
      return {
        langList: [
          {
            name: 'zh-CN',
            title: '中文'
          },
          {
            name: 'en-US',
            title: 'English'
          }
        ]
      };
    },
    methods: {
      setLang (lang) {
        this.$store.commit('switchLang',lang);
      }
    },
    computed: {
        lang:function () {
          return this.$store.state.app.lang;
        }
    }
  };
</script>
