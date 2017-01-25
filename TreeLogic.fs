module TreeLogic

open Types

//helper functions
let self k tree =
    tree |> Array.find (fun x -> k = x.key)

let ancestors k tree =
    let rec ann k2 tree2 nodes = //exluding root
        let x = (self k2 tree2)
        match x.ntype with 
        | TRoot -> nodes
        | _ -> ann x.parent tree2 (x::nodes)
    ann k tree [] |> List.toArray 

let children k tree =
    tree |> Array.filter (fun x -> x.parent = k)

let parent k tree =
    let p = k.parent
    tree |> Array.find (fun x -> x.key = p)

let leafs2 tree =
    tree |> Array.filter (fun x -> match x.ntype with
                                    | TRoot -> false
                                    | TLeaf -> true
                                    | TBranch -> false)

let rec leafs k tree =
    Array.collect (fun x -> match x.ntype with 
                            | TLeaf -> Array.singleton x
                            | TBranch -> leafs k tree
                            | TRoot -> Array.empty ) (children k tree)



let root tree =
    tree |> Array.find (fun x -> match x.ntype with
                                    | TRoot-> true
                                    | TLeaf -> false
                                    | TBranch -> false)

let depth k tree =
    let l1 = (ancestors k tree).Length
    let l2 = (children k tree) |> Array.fold (fun max x -> greater (ancestors k tree).Length max) 0
    (l1+1,l2+1)

let size t =
     let lfs = (leafs2 t)
     (Array.fold (fun acc x -> greater x.size.get acc ) 0.0 lfs) + (Array.head lfs).data.distance

let size_ext n = n.extsize


//calculate sizes and realtive scaling factor
let calc_sizes p tree =
    for x in tree do
        let multi = match x.ntype with
                    | TRoot -> 1.0
                    | TLeaf -> p.parent_to_children_scaling
                    | TBranch -> let depth = depth x.key tree
                                 p.parent_to_children_scaling * (1.0 + (float (fst depth))/(float (snd depth)))
        x.data.scale <- multi
    tree

//populate angular resoultion
let calc_ar p tree =
    let metric k = Array.sumBy (fun x -> x.size.get*x.data.scale) (leafs k tree)
    let rec arinternal k (mp :float) (arp :float<rad>) = 
        Array.collect (fun x -> let mx = (metric x.key)
                                let arx = (arp/mp * mx)
                                [|(x.data.ar <- arx; x)|] |+| (arinternal x.key mx arx)) (children k tree) 
    let root = (root tree)
    [|(root.data.ar <-tau; root)|] |+| (arinternal root.key (metric root.key) tau )


//populate angles
let calc_theta p tree =
    let rec ctheta k theata =
        (children k tree) |> p.sort 
                          |> Array.mapFold (fun th x -> (x.data.angle<-th+0.5*x.data.ar;x,th+x.data.ar) ) theata
                          |> fst
                          |> Array.collect (fun x -> match x.ntype with
                                                        | TBranch -> ctheta x.key (x.data.angle - 0.5*x.data.ar)
                                                        | _-> Array.singleton x ) 
    ctheta (root tree).key 0.0<rad> |+| Array.singleton (root tree)

//populate distances
let calc_d p tree =
    let size_r = (root tree).size.get*(root tree).data.scale
    let qx q = cos(q.data.angle)*q.data.distance
    let qy q = sin(q.data.angle)*q.data.distance
    let cd n t = 
        let d1 = n.size.get*n.data.scale + size_r
        let d2 = if n.data.ar > tau/4.0 || n.data.ar = 0.0<rad> then 0.0 else n.size.get / (sin(n.data.ar / 2.0))
        let d3 = (parent n t).data.distance
        let d4 = (ancestors n.key t) |> Array.map (fun x -> (qx x)*cos(n.data.angle) + 
                                                               (qy x)*sin(n.data.angle) +
                                                               sqrt( sqr(n.size.get*n.data.scale+x.size.get*x.data.scale) - sqr((qx x)*sin(n.data.angle) - (qy x)*cos(n.data.angle)) ))
        ([|d1;d2;d3|] |+| d4) |> Array.fold greater 0.0

    let rec calc_min k t = //error
        let tre = t |> Array.map (fun x -> if x.parent = k then x.data.distance<-cd x t; x else x)
        (children k tre) |> Array.collect (fun x -> match x.ntype with
                                                      | TBranch -> calc_min x.key t
                                                      | _ -> Array.singleton x)  
    let temp = tree |> calc_min (root tree).key
    let d_leaf = temp |> Array.fold (fun max x -> greater max x.data.distance) 0.0
    [|(root tree)|] |+| temp |> Array.map (fun x -> match x.ntype with
                                                    | TLeaf -> x.data.distance<-d_leaf; x
                                                    | _ -> x )

//clean rare intersection cases
let clean_intersections p tree =
    tree

let calc_rel_position p tree =
    tree |> Array.map (fun x -> x.data.pos <- (cos(x.data.angle)*x.data.distance,sin(x.data.angle)*x.data.distance) ; x)



let calc_tree p tree =
    tree |> calc_sizes p
         |> calc_ar p
         |> calc_theta p
         |> calc_d p
         |> clean_intersections p
         |> calc_rel_position p

let rec dfs_calc_tree p tree  =
    tree |> Array.map (fun x -> 
        match x.element with
        | Tree(t) ->  let t3 = dfs_calc_tree p t 
                      x.element<-Tree(t3)
                      x.extsize.set (size t3)
                      x
        | _ -> x ) |> calc_tree p

let rec map_absolute_pos_scale p ((x,y),scale) tree  =
    tree |> Array.map (fun n ->
        let acc = (x+(fst n.data.pos),y+(snd n.data.pos)),scale*n.data.scale
        n.position.set (fst acc)
        printfn "abs pos %f %f" (fst (fst acc)) (snd (fst acc))
        n.scale.set (snd acc)
        match n.element with
        | Tree(t) -> {n with element=Tree(map_absolute_pos_scale p acc t)}
        | _ -> n )
    

let calc_abs_position_scale p tree =
    map_absolute_pos_scale p ((0.0,0.0),1.0) tree
        
let render_tree p tree =
    tree |> dfs_calc_tree p |> calc_abs_position_scale p
 
let calc_leafs (p :Params) tree =
    let big = tree |> Array.map (fun x -> match x.element with
                                            | Tree(t) -> t
                                            | _ -> Array.singleton x) |> Array.concat
    let rec dig k d tree =
        let c =  children k.key tree
        let c2 = c |> Array.map (fun x -> dig x (d+1) tree) |> Array.concat
        if c.Length > p.div_tree_threshold then
            k.ntype <- TLeaf
            k.element <- Tree c2
        else if c.Length > 0 then
            k.ntype <- TBranch
        else
            k.ntype <- TLeaf
        [|k|] |+| c2
    dig (root tree) 0 big

