const generateBlock = (nodeId, depth, position) => ({
  nodeId,
  isActive: true,
  value: "",
  children: null,
  depth: depth || 0,
  position: position || Date.now() * 100,
  references: [],
});

export default (state, action) => {
  switch (action.type) {
    case "SET_TREE": {
      return action.tree;
    }
    case "ADD_NEW_BLOCK": {
      let newTree = state.slice();
      newTree.splice(
        action.index,
        0,
        generateBlock(action.nodeId, action.depth, action.position)
      );
      return newTree;
    }
    case "SET_BLOCK_VALUE": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        value: action.value,
      });
      return newTree;
    }
    case "SET_BLOCK_DEPTH": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        depth: action.depth,
      });
      return newTree;
    }
    case "SET_BLOCK_PARENT": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        parent: action.parent,
      });
      return newTree;
    }
    case "SET_BLOCK_ACTIVE": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        isActive: action.value,
      });
      return newTree;
    }
    case "DELETE_BLOCK": {
      let newTree = state.slice();
      newTree.splice(action.index, 1);
      return newTree;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

