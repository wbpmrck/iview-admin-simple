<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="24">
                <Card>
                    <p slot="title">{{$t('title.home')}}</p>
                    <Input v-model="val" icon="ios-clock-outline" placeholder="Enter something..." style="width: 200px"></Input>
                    <p>{{$t('views.home.desc1')}}</p>
                    <p>{{$t('views.home.desc2')}}</p>
                    <p>{{$t('views.home.desc3')}}</p>
                    <p>{{$t('views.home.desc4')}}</p>
                </Card>
            </Col>

        </Row>
    </div>
</template>

<script>

export default {
    name: 'home',
    components: {
    },
    data () {
        return {
            val:''
        };
    },
    computed: {
    },
    methods: {
    }
};
</script>
