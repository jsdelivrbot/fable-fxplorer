module UILogic

open System.Collections.Generic
open System
open Fable.Import.Mithril
open Fable.Import.MithrilBase
open Fable.Import.Browser
open Fable.Core.JsInterop
open Fable.Core
open Types
open TreeLogic

 [<Emit("console.debug $0")>]
let debug x = jsNative

type Point = {x :float; y :float} 
let point (_x :float) (_y :float) :Point = {x = _x; y = _y} 

type Engine(t,c) =

    let config = property c
    let tree = property t

    let scale = property 0.0

    let translation = property (point 0.0 0.0)

    let mutable lastDragPoint = None
    let mutable lastMousePositionOnTarget = None

    let mutable lastCenterPositionOnTarget = None

    member this.Tree = tree

    member this.Config= config

    member this.Resize key size =
        let index = tree.get |> Array.findIndex (fun x -> x.key = key)
        tree.get.[index].size.set size

   
    member this.Add parent =
      let nkey = 1 + (tree.get |> Array.maxBy (fun x -> x.key)).key
      let name = "new.txt"
      let nnode = (newNode nkey parent (TextBox name) TLeaf)
      tree.set (calc_leafs config.get (tree.get |+| [|nnode|]))

    member this.Pan (evt :Event)  =
        let e = (evt :?> MouseEvent)
        match lastDragPoint with
        | Some(dp) -> 
            translation.set (point (translation.get.x + (e.clientX - dp.x)) (translation.get.y + (e.clientY - dp.y)))
            lastDragPoint <- Some(point e.clientX e.clientY)
        | None -> ()

    member this.Zoom (evt :Event)  =
        let e = (evt :?> MouseWheelEvent)
        //lastMousePositionOnTarget <- Some(childpos)
        match (e.wheelDelta,scale.get) with //user logmerithic scaling
            | (d,s) when (d > 0.0) && (s >= 1.0) -> scale.set (s + 0.5)
            | (d,s) when (d > 0.0)  -> scale.set (s + 0.1)
            | (d,s) when (d < 0.0) && (s > 1.0) -> scale.set (s - 0.5)
            | (d,s) when (d < 0.0) && (s > 0.1) -> scale.set (s- 0.1)
            | (_,_) -> ()
        //lastCenterPositionOnTarget <- Some(tp)

    member this.EndPan ()  =
        lastDragPoint <- None

    member this.StartPan (evt :Event)  =
        let e = (evt :?> MouseEvent)
        lastDragPoint <- Some(point e.clientX e.clientY)


    interface Controller with
        member x.onunload evt = () :> obj


let createTextBoxELM (n :Node) (f :string) (engine :Engine) =
    //resize event
    //context menu or button for add
    let translation = sprintf "translate(%fpx,%fpx) scale(%f,%f)" (fst n.position.get) (snd n.position.get) n.scale.get n.scale.get
    debug translation
    let textbox = textarea (attr []) [f]
    let v = div (attr [css [("-web-kit-transfrom-origin",translation);
                            ("transform-origin", translation)]]) 
                [textbox]
    v
let rec createELM (n :Node) (engine :Engine) =
    match n.element with
    | Tree(t) -> div None (t |> Array.map (fun x -> (createELM x engine) :> obj) |> Array.toList)
    | TextBox(f) -> createTextBoxELM n f engine


//TREE
let createTreeView (engine :Engine) =
    let root = 
        div (attr [ onMouseUp (fun e -> engine.EndPan() );
                    onMouseDown engine.StartPan;
                    onMouseMove engine.Pan; 
                    onEvent "wheel" (fun e -> 
                        e.preventDefault(); 
                        engine.Zoom e)])
            (engine.Tree.get |> Array.map (fun x -> (createELM x engine) :> obj) |> Array.toList)
    let origin = div (attr [css [("position","relative");("width","0px");("height","0px")]]) [root]
    origin

    

//WINDOW
let createWindow () =
    let orgin = [| (newNode 0 -1 (TextBox "Hello") TRoot)
                   (newNode 1 0 (TextBox "Hi") TLeaf)
                   (newNode 2 0 (TextBox "test") TLeaf)
                |] 
    let engine = Engine(orgin,{div_tree_threshold=10; parent_to_children_scaling=0.5; ar_scaleing=1.0; sort=(fun x -> x)})
    let vminit x = engine
    let com = newComponent vminit createTreeView
    com

mount(document.body,createWindow()) |> ignore