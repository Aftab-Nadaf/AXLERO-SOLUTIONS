package Server.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@SpringBootApplication
public class BackendApplication {
    @RequestMapping("/")
    String greet() {

        return "Hello World";
    }

    public static void main(String[] args) {
        System.out.println("The Server Start......");
        System.out.println("Click----->        " + "http://localhost:8080");
        SpringApplication.run(BackendApplication.class, args);
    }

}
