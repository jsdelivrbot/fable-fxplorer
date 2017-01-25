module Types

open System
open Fable.Import.Mithril
open Fable.Import

[<Measure>]
type rad 

[<Literal>]
let tau=6.283185307179586476925286766559<rad>

let inline (|+|) a b = Array.append a b

let inline greater a b = if a > b then a else b

let inline sqr a = a * a

let inline sin (x :float<rad>)  = (x*(360.0/tau)) |> float |> sin 

let inline cos (x :float<rad>)  = (x*(360.0/tau)) |> float |> cos 

type NodeType =
    | TRoot
    | TLeaf
    | TBranch

type NodeData = {
    mutable distance :float
    mutable ar :float<rad>
    mutable angle :float<rad>
    mutable pos :float*float
    mutable scale :float
    } 

and Tree = Node array

and Element =
    | Tree of Tree
    | TextBox of string

and Node = 
    {key :int 
     parent :int
     data :NodeData 
     mutable element :Element 
     mutable ntype :NodeType
     mutable scale :MithrilBase.Property<float>
     mutable position :MithrilBase.Property<float*float>
     mutable size :MithrilBase.Property<float>
     mutable extsize :MithrilBase.Property<float>
     }

type Params =
    { div_tree_threshold :int 
      parent_to_children_scaling :float //0.5 is half the size
      ar_scaleing :float
      sort :Tree -> Tree}

let newND = {distance=0.0; ar=0.0<rad>; angle=0.0<rad>; pos=(0.0,0.0); scale=0.0;}
let newNode key parent element ntype = 
    {key=key;
    data=newND;
    element=element;
    parent=parent;
    ntype=ntype;
    scale=property 1.0;
    size=property 1.0;
    position=property (0.0,0.0);
    extsize=property 1.0}