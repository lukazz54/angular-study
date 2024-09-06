import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  //Quando uma prpriedade retorna um Observable, como boa pratica
  //da comunidade Angular é inserido o dolar ($) no final.
  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  public productsDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(products: Array<GetAllProductsResponse>) :void {
    if (products) {
      this.productsDataEmitter$.next(products);
      this.getProductsDatas();
    }
  }
  getProductsDatas() {
    //operador take, ele chama o observable o numero de vezes que
    //é colocado no argumento, e depois se desinscreve daquele observable
    // com comando para evitar Memory Leak
    this.productsDataEmitter$.pipe(
      take(1),
      map((data) => data?.filter((product) => product.amount > 0))
    )
    .subscribe({
      next: (response) => {
        if(response) {
          this.productsDatas = response;
        }
      }
    });
    return this.productsDatas
  }
}
