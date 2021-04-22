import Component from '@glimmer/component';
export default class IdeasFilterComponent extends Component{
    get results(){
        let{ideas, query} = this.args;

        if(query){
            ideas = ideas.filter((idea) => idea.title.includes(query));
        }
        return ideas;
    }
}