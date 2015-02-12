# Strongly connected graph

In the mathematical theory of [directed graphs](http://en.wikipedia.org/wiki/Directed_graph), a graph is said to be **strongly connected** if every vertex is [reachable](http://en.wikipedia.org/wiki/Reachable) from every other vertex. The **strongly connected components** of an arbitrary directed graph form a [partition](http://en.wikipedia.org/wiki/Partition) into subgraphs that are themselves strongly connected. It is possible to test the strong connectivity of a graph, or to find its strongly connected components, in [linear time](http://en.wikipedia.org/wiki/Linear_time).

## Definitions

A [directed graph](http://en.wikipedia.org/wiki/Directed_graph) is called **strongly connected** if there is a [path](http://en.wikipedia.org/wiki/Path) in each direction between each pair of vertices of the graph. In a directed graph *G* that may not itself be strongly connected, a pair of vertices *u* and *v* are said to be strongly connected to each other if there is a path in each direction between them.

The [binary relation](http://en.wikipedia.org/wiki/Binary_relation) of being strongly connected is an [equivalence relation](http://en.wikipedia.org/wiki/Equivalence_relation), and the [induced subgraphs](http://en.wikipedia.org/wiki/Induced_subgraph) of its [equivalence classes](http://en.wikipedia.org/wiki/Induced_subgraph) are called **strongly connected components**. Equivalently, a **strongly connected component** of a directed graph *G* is a subgraph that is strongly connected, and is [maximal](http://en.wikipedia.org/wiki/Maximal) with this property: no additional edges or vertices from *G* can be included in the subgraph without breaking its property of being strongly connected. The collection of strongly connected components forms a [partition][1] of the set of vertices of *G*.

If each strongly connected component is [contracted](http://en.wikipedia.org/wiki/Contracted) to a single vertex, the resulting graph is a [directed acyclic graph](http://en.wikipedia.org/wiki/DAG), the **condensation** of *G*. A directed graph is acyclic if and only if it has no strongly connected subgraphs with more than one vertex, because a directed cycle is strongly connected and every nontrivial strongly connected component contains at least one directed cycle.

## Algorithms

Several algorithms can compute strongly connected components in [linear
time](http://en.wikipedia.org/wiki/Linear_time).

-   [Kosaraju's algorithm](http://en.wikipedia.org/wiki/DAG) uses two passes of [depth first search](http://en.wikipedia.org/wiki/DAG). The first, in the original graph, is used to choose the order in which the outer loop of the second depth first search tests vertices for having been visited already and recursively explores them if not. The second depth first search is on the [transpose graph](http://en.wikipedia.org/wiki/DAG) of the original graph, and each recursive exploration finds a single new strongly connected component. It is named after [S. Rao Kosaraju](http://en.wikipedia.org/wiki/DAG), who described it (but did not publish his results) in 1978; [Micha Sharir](http://en.wikipedia.org/wiki/DAG) later published it in 1981.
-   [Tarjan's strongly connected components algorithm](http://en.wikipedia.org/wiki/DAG), published by [Robert Tarjan](http://en.wikipedia.org/wiki/DAG) in 1972, performs a single pass of depth first search. It maintains a [stack](http://en.wikipedia.org/wiki/DAG) of vertices that have been explored by the search but not yet assigned to a component, and calculates “low numbers” of each vertex (an index number of the highest ancestor reachable in one step from a descendant of the vertex) which it uses to determine when a set of vertices should be popped off the stack into a new component.
-   The [path-based strong component algorithm](http://en.wikipedia.org/wiki/DAG) uses a depth first search, like Tarjan's algorithm, but with two stacks. One of the stacks is used to keep track of the vertices not yet assigned to components, while the other keeps track of the current path in the depth first search tree. The first linear time version of this algorithm was published by [Edsger W. Dijkstra](http://en.wikipedia.org/wiki/DAG) in 1976.

Although Kosaraju's algorithm is conceptually simple, Tarjan's and the
path-based algorithm are favoured in practice since they require only
one [depth-first search](http://en.wikipedia.org/wiki/DAG) rather than two.

## Applications

Algorithms for finding strongly connected components may be used to
solve [2-satisfiability](http://en.wikipedia.org/wiki/DAG) problems (systems of Boolean variables with constraints on the values of pairs of variables): as showed, a [2-satisfiability](http://en.wikipedia.org/wiki/DAG) instance is unsatisfiable if and only if there is a variable *v* such that *v* and its complement are both contained in the same strongly connected component of the [implication graph](http://en.wikipedia.org/wiki/DAG) of the instance.

Strongly connected components are also used to compute the [Dulmage–Mendelsohn decomposition](http://en.wikipedia.org/wiki/DAG), a classification of the edges of a [bipartite graph](http://en.wikipedia.org/wiki/DAG), according to whether or not they can be part of a [perfect matching](http://en.wikipedia.org/wiki/DAG) in the graph.

## Related results

A directed graph is strongly connected if and only if it has an [ear decomposition](http://en.wikipedia.org/wiki/DAG), a partition of the edges into a sequence of directed paths and cycles such that the first subgraph in the sequence is a cycle, and each subsequent subgraph is either a cycle sharing one vertex with previous subgraphs, or a path sharing its two endpoints with previous subgraphs.

According to [Robbins' theorem](http://en.wikipedia.org/wiki/DAG), an undirected graph may be [oriented](http://en.wikipedia.org/wiki/Linear_time) in such a way that it becomes strongly connected, if and only if it is [2-edge-connected](http://en.wikipedia.org/wiki/DAG). One way to prove this result is to find an ear decomposition of the underlying undirected graph and then orient each ear consistently.

## See also

-   [Connected component](http://en.wikipedia.org/wiki/DAG)
-   [Modular decomposition](http://en.wikipedia.org/wiki/DAG)

## We all like making lists

The above header should be an H2 tag. Now, for a list of fruits:

* Red Apples
* Purple Grapes
* Green Kiwifruits

Let's get crazy:

1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.

What about some code **in** a list? That's insane, right?

1. In Ruby you can map like this:

```ruby
['a', 'b'].map { |x| x.uppercase }
```

2. In Rails, you can do a shortcut:

```ruby
['a', 'b'].map(&:uppercase)
```

Some people seem to like definition lists

<dl>
  <dt>Lower cost</dt>
  <dd>The new version of this product costs significantly less than the previous one!</dd>
  <dt>Easier to use</dt>
  <dd>We've changed the product so that it's much easier to use!</dd>
</dl>

## I am a robot

Maybe you want to print `robot` to the console 1000 times. Why not?

```ruby
class Car < ActiveRecord::Base
  has_many :wheels, class_name: 'Wheel', foreign_key: 'car_id'
  scope :available, -> { where(available: true) }
end
```
You see, that was formatted as code because it's been indented by four spaces.

How about we throw some angle braces and ampersands in there?

```html
<div class="footer">
    &copy; 2004 Foo Corporation
</div>
```

CSV:

```csv
Year,Make,Model,Length
2/5/08,Ford,E350,2.34
1/2/06,Mercury,Cougar,2.38
```

## Set in stone

Preformatted blocks are useful for ASCII art:

<pre>
             ,-.
    ,     ,-.   ,-.
   / \   (   )-(   )
   \ |  ,.>-(   )-<
    \|,' (   )-(   )
     Y ___`-'   `-'
     |/__/   `-'
     |
     |
     |    -hrr-
  ___|_____________
</pre>

## Playing the blame game


If you need to blame someone, the best way to do so is by quoting them:

> I, at any rate, am convinced that He does not throw dice.

Or perhaps someone a little less eloquent:

> I wish you'd have given me this written question ahead of time so I
> could plan for it... I'm sure something will pop into my head here in
> the midst of this press conference, with all the pressure of trying to
> come up with answer, but it hadn't yet...
>
> I don't want to sound like
> I have made no mistakes. I'm confident I have. I just haven't - you
> just put me under the spot here, and maybe I'm not as quick on my feet
> as I should be in coming up with one.

## Table for two


<table>
  <tr>
    <th>ID</th><th>Name</th><th>Rank</th>
  </tr>
  <tr>
    <td>1</td><td>Tom Preston-Werner</td><td>Awesome</td>
  </tr>
  <tr>
    <td>2</td><td>Albert Einstein</td><td>Nearly as awesome</td>
  </tr>
</table>

## Crazy linking action

I get 10 times more traffic from [Google] [1] than from
[Yahoo] [2] or [MSN] [3].

  [1]: http://google.com/        "Google"
  [2]: http://search.yahoo.com/  "Yahoo Search"
  [3]: http://search.msn.com/    "MSN Search"
