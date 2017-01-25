module UITypes


open System
open Types




type EBase( _key, _size:IMutatable<float> , _scale:IMutatable<float>, _pos: IMutatable<float*float>) as this =
    inherit Border()

    do base.CornerRadius <- CornerRadius(100.0)
    do base.BorderBrush <- Brushes.AliceBlue
    do base.BorderThickness <- Windows.Thickness(1.0)
    let stran = ScaleTransform()
    do base.LayoutTransform <- stran
    do base.HorizontalAlignment <- HorizontalAlignment.Center
    do base.VerticalAlignment <- VerticalAlignment.Center

    let posob = _pos.SubscribeOn(this.Dispatcher) |> Observable.subscribe (fun x -> 
                                                                Canvas.SetLeft(this,fst x)
                                                                Canvas.SetTop(this,snd x) )

    let scaleob = _scale.SubscribeOn(stran.Dispatcher) |> Observable.subscribe (fun z -> stran.ScaleX <- z
                                                                                         stran.ScaleY <- z)
    
    override this.MeasureOverride(nan :Size) =
        base.Child.Measure(nan)
        let s = this.Child.DesiredSize
        let s2 = (0.5 * Math.Sqrt(s.Width*s.Width + s.Height*s.Height))
        if not (Mutable.get _size = s2) then Mutable.set _size s2
        Size(s2*2.0,s2*2.0)

    member x.Key with get () =  _key
    member x.Radius with get () : IMutatable<float> = _size 
    member x.Scale with get () : IMutatable<float> = _scale
    member x.Position with get () : IMutatable<float*float> = _pos


let (|<|) a b = if a < b then a else b
let (|>|) a b = if a > b then a else b

type CenteredCanvas() =
    inherit Canvas()

    let mutable cen_y = 0.0
    let mutable cen_x = 0.0

    override this.MeasureOverride(nan :Size) =
        let mutable min_x = 0.0
        let mutable max_x = 0.0
        let mutable min_y = 0.0
        let mutable max_y = 0.0
        for e in base.InternalChildren do
            e.Measure(nan)
            match e with 
            | :? EBase as el -> min_x <- min_x |<| fst el.Position.Value + e.DesiredSize.Width
                                max_x <- max_x |>| fst el.Position.Value + e.DesiredSize.Width
                                min_y <- min_y |<| snd el.Position.Value + e.DesiredSize.Height
                                max_y <- max_y |>| snd el.Position.Value + e.DesiredSize.Height
            | _ -> ()
        let width = (max_x - min_x)*1.2
        let height = (max_y - min_y)*1.2
        cen_y <- max_y
        cen_x  <- max_x
        Size(width,height)

    override this.ArrangeOverride(size) =
        for e in base.InternalChildren do
            match e with
            | :? EBase as el  -> let l = fst el.Position.Value + cen_x - el.Radius.Value
                                 let b = cen_y - snd el.Position.Value - el.Radius.Value
                                 el.Arrange(Rect(  Point( l, b), e.DesiredSize ))
            | _ -> ()

        size

type TreePanel() = 
    inherit ScrollViewer() 

    let can = CenteredCanvas()
    let stran = ScaleTransform()
    do base.LayoutTransform <- stran
    do base.HorizontalScrollBarVisibility <- ScrollBarVisibility.Visible
    do base.VerticalScrollBarVisibility <- ScrollBarVisibility.Visible
    do base.Content <- can

    let mutable lastCenterPositionOnTarget :Point option  = None
    let mutable lastMousePositionOnTarget :Point option  = None
    let mutable lastDragPoint :Point option = None

    member this.canvas with get () = can

    member this.Pan (p :Point)  =
        match lastDragPoint with
        | Some(dp) -> 
            this.ScrollToHorizontalOffset(this.HorizontalOffset - p.X + dp.X)
            this.ScrollToVerticalOffset( this.VerticalOffset - p.Y + dp.Y)
            lastDragPoint <- Some(p)
        | None -> ()

    member this.Zoom point delta childpos tp  =
        lastMousePositionOnTarget <- Some(childpos)
        let mutable scale = stran.ScaleX
        match (delta,scale) with
            | (d,s) when (d > 0) && (s >= 1.0) -> scale <- scale + 0.5
            | (d,s) when (d > 0)  -> scale <- scale + 0.1
            | (d,s) when (d < 0) && (s > 1.0) -> scale <- scale - 0.5
            | (d,s) when (d < 0) && (s > 0.1) -> scale <- scale - 0.1
            | (_,_) -> ()
        stran.ScaleX <- scale
        stran.ScaleY <- scale
        lastCenterPositionOnTarget <- Some(tp)

    member this.EndPan ()  =
        this.Cursor <- Cursors.Arrow
        lastDragPoint <- None
        this.ReleaseMouseCapture()

    member this.StartPan (p :Point) w h  =
        if (p.X <= w && p.Y < h) then 
            this.Cursor <- Cursors.SizeAll
            lastDragPoint <- Some(p)
            this.CaptureMouse() |> ignore

    member this.Scroll ehc ewc vpw vph pos tp cw ch ew eh =
        if not(ehc=0.0) || not(ewc=0.0) then
            let mutable oldtarget,(newtarget :Point option) = None,None
            match lastMousePositionOnTarget,lastCenterPositionOnTarget with
            | Some(mp),Some(cp) -> oldtarget <- lastCenterPositionOnTarget
                                   newtarget <- Some(tp)
            | _,_ -> newtarget <- Some(pos)
                     oldtarget <- lastMousePositionOnTarget
                     lastMousePositionOnTarget <- None
            match oldtarget,newtarget with 
            | Some(ot),Some(nt) ->  this.ScrollToHorizontalOffset(this.HorizontalOffset - (nt.X - ot.X)*(ew/cw))
                                    this.ScrollToVerticalOffset( this.VerticalOffset - (nt.Y - ot.Y)*(eh/ch))
            | _,_ -> ()

