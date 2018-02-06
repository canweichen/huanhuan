<?php
namespace app\frontIndex\controller;
use think\Controller;
use \think\Request;
use \think\Db;
use think\Session;
use \think\File;
class PublishTrade extends Controller
{
    /**introduction:
     * 该控制器主要是用于二收商品的发布
     * */
    //发布商品
    public function publish(){
        $tradeType=db('t_tradesort')->limit(0,6)->select();
        $degree=db('t_tradedegree')->select();
        $brand=db('t_tradesort')
            ->where('fid',1)
            ->select();
        $data=[
            'data'=>json_encode(['type' => $tradeType ,
                'degree' => $degree ,
                'brand' => $brand])
        ];
        $this->assign('info',$data);
        return $this->fetch('userPage/publish');
    }
    //获取类型品牌
    public function getNodeType(){
        $id=input('?post.id')?input('id'):'';
        $data=db('t_tradesort')->where('fid',$id)->select();
        echo json_encode($data);
    }
}