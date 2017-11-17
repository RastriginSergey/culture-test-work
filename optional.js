class ListToTree {
    constructor(list) {
        this.list = list;
        this.root = {id: 0, parentId: 0, children: []};
    }

    build(node) {
        node.children = this.list.filter(({parentId}) => parentId === node.id);

        if (node.children.length) {
            node.children.forEach(child => this.build(child));
        } else {
            delete node.children;
        }
    }

    run() {
        this.build(this.root);
        return this.root;
    }
}
module.exports = ListToTree;