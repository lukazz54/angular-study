export interface EditCategoryAction {
  action: string;
  id?: string;
  categoryName?: string
  //nesse caso o ? indica que o campo nao eh obrigatorio
}
