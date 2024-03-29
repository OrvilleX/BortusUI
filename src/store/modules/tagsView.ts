import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Route } from 'vue-router'
import store from '@/store'

export interface TagView extends Partial<Route> {
  title?: string
}

export interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: (string | undefined)[]
}

@Module({ dynamic: true, store, name: 'tagsView' })
class TagsView extends VuexModule implements TagsViewState {
  public visitedViews: TagView[] = []
  public cachedViews: (string | undefined)[] = []

  @Mutation
  private ADD_VISITED_VIEW(view: TagView) {
    if (this.visitedViews.some(v => v.path === view.path)) return
    this.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  }

  @Mutation
  private ADD_CACHED_VIEW(view: TagView) {
    if (view.name === null) return
    if (this.cachedViews.includes(view.name)) return
    if (!view.meta?.noCache) {
      this.cachedViews.push(view.name)
    }
  }

  @Mutation
  private DEL_VISITED_VIEW(view: TagView) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
  }

  @Mutation
  private DEL_CACHED_VIEW(view: TagView) {
    if (view.name === null) return
    const index = this.cachedViews.indexOf(view.name)
    index > -1 && this.cachedViews.splice(index, 1)
  }

  @Mutation
  private DEL_OTHERS_VISITED_VIEWS(view: TagView) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.meta?.affix || v.path === view.path
    })
  }

  @Mutation
  private DEL_OTHERS_CACHED_VIEWS(view: TagView) {
    if (view.name === null) return
    const index = this.cachedViews.indexOf(view.name)
    if (index > -1) {
      this.cachedViews = this.cachedViews.slice(index, index + 1)
    } else {
      this.cachedViews = []
    }
  }

  @Mutation
  private DEL_ALL_VISITED_VIEWS() {
    const affixTags = this.visitedViews.filter(tag => tag.meta?.affix)
    this.visitedViews = affixTags
  }

  @Mutation
  private DEL_ALL_CACHED_VIEWS() {
    this.cachedViews = []
  }

  @Mutation
  private UPDATE_VISITED_VIEW(view: TagView) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  @Action
  public addView(view: TagView) {
    this.ADD_VISITED_VIEW(view)
    this.ADD_CACHED_VIEW(view)
  }

  @Action
  public addVisitedView(view: TagView) {
    this.ADD_VISITED_VIEW(view)
  }

  @Action
  public addCachedView(view: TagView) {
    this.ADD_CACHED_VIEW(view)
  }

  @Action
  public delView(view: TagView) {
    this.DEL_VISITED_VIEW(view)
    this.DEL_CACHED_VIEW(view)
  }

  @Action
  public delVisitedView(view: TagView) {
    this.DEL_VISITED_VIEW(view)
  }

  @Action
  public delCachedView(view: TagView) {
    this.DEL_CACHED_VIEW(view)
  }

  @Action
  public delOthersViews(view: TagView) {
    this.DEL_OTHERS_VISITED_VIEWS(view)
    this.DEL_OTHERS_CACHED_VIEWS(view)
  }

  @Action
  public delOthersVisitedViews(view: TagView) {
    this.DEL_OTHERS_VISITED_VIEWS(view)
  }

  @Action
  public delOthersCachedViews(view: TagView) {
    this.DEL_OTHERS_CACHED_VIEWS(view)
  }

  @Action
  public delAllViews() {
    this.DEL_ALL_VISITED_VIEWS()
    this.DEL_ALL_CACHED_VIEWS()
  }

  @Action
  public delAllVisitedViews() {
    this.DEL_ALL_VISITED_VIEWS()
  }

  @Action
  public delAllCachedViews() {
    this.DEL_ALL_CACHED_VIEWS()
  }

  @Action
  public updateVisitedView(view: TagView) {
    this.UPDATE_VISITED_VIEW(view)
  }
}

export const TagsViewModule = getModule(TagsView)
